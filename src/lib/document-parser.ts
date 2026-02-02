import Tesseract from "tesseract.js";
import mammoth from "mammoth";

// Dynamically import PDF.js to avoid top-level await issues
let pdfjsLib: typeof import("pdfjs-dist") | null = null;

async function getPdfjs() {
  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist");
    // Use the same version as the installed package
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  }
  return pdfjsLib;
}

export interface ParseProgress {
  stage: "loading" | "extracting" | "ocr" | "complete";
  progress: number;
  message: string;
}

export interface ParseResult {
  text: string;
  isScanned: boolean;
  pageCount: number;
  ocrConfidence?: number;
  fileType: "pdf" | "docx" | "doc";
}

export type SupportedFileType = "pdf" | "docx" | "doc";

/**
 * Check if a file type is supported
 */
export function getSupportedFileType(file: File): SupportedFileType | null {
  const extension = file.name.toLowerCase().split(".").pop();
  const mimeType = file.type.toLowerCase();

  // PDF
  if (mimeType === "application/pdf" || extension === "pdf") {
    return "pdf";
  }

  // DOCX
  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === "docx"
  ) {
    return "docx";
  }

  // DOC (legacy Word)
  if (mimeType === "application/msword" || extension === "doc") {
    return "doc";
  }

  return null;
}

/**
 * Check if a file is valid (PDF or Word)
 */
export function isValidDocument(file: File): boolean {
  return getSupportedFileType(file) !== null;
}

/**
 * Extract text from a document file (PDF or Word)
 */
export async function extractTextFromDocument(
  file: File,
  onProgress?: (progress: ParseProgress) => void
): Promise<ParseResult> {
  const fileType = getSupportedFileType(file);

  if (!fileType) {
    throw new Error("Formato de arquivo não suportado. Use PDF ou Word (.docx).");
  }

  if (fileType === "pdf") {
    return extractTextFromPDF(file, onProgress);
  }

  if (fileType === "docx") {
    return extractTextFromDOCX(file, onProgress);
  }

  if (fileType === "doc") {
    throw new Error(
      "Arquivos .doc (Word antigo) não são suportados. Por favor, salve como .docx ou PDF."
    );
  }

  throw new Error("Formato não suportado.");
}

/**
 * Extract text from a Word document using mammoth
 */
async function extractTextFromDOCX(
  file: File,
  onProgress?: (progress: ParseProgress) => void
): Promise<ParseResult> {
  onProgress?.({
    stage: "loading",
    progress: 10,
    message: "Carregando documento Word...",
  });

  try {
    const arrayBuffer = await file.arrayBuffer();

    onProgress?.({
      stage: "extracting",
      progress: 40,
      message: "Extraindo texto do Word...",
    });

    const result = await mammoth.extractRawText({ arrayBuffer });

    if (!result.value || result.value.trim().length < 20) {
      throw new Error("Documento Word vazio ou sem texto legível.");
    }

    onProgress?.({
      stage: "complete",
      progress: 100,
      message: "Extração completa!",
    });

    // Count approximate pages (roughly 2500 chars per page)
    const pageCount = Math.max(1, Math.ceil(result.value.length / 2500));

    return {
      text: cleanText(result.value),
      isScanned: false,
      pageCount,
      fileType: "docx",
    };
  } catch (error) {
    console.error("Error extracting DOCX:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Erro ao processar documento Word. Verifique se o arquivo está correto."
    );
  }
}

/**
 * Extract text from a PDF file using pdf.js for text-based PDFs
 * and Tesseract.js OCR for scanned/image-based PDFs
 */
async function extractTextFromPDF(
  file: File,
  onProgress?: (progress: ParseProgress) => void
): Promise<ParseResult> {
  onProgress?.({
    stage: "loading",
    progress: 0,
    message: "Carregando PDF...",
  });

  try {
    // Get PDF.js dynamically
    const pdfjs = await getPdfjs();

    // Load the PDF
    const arrayBuffer = await file.arrayBuffer();
    
    let pdf;
    try {
      pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    } catch (pdfError) {
      console.error("PDF load error:", pdfError);
      throw new Error(
        "Não foi possível abrir o PDF. O arquivo pode estar corrompido ou protegido por senha."
      );
    }

    const pageCount = pdf.numPages;

    if (pageCount === 0) {
      throw new Error("O PDF não contém páginas.");
    }

    onProgress?.({
      stage: "extracting",
      progress: 10,
      message: "Extraindo texto...",
    });

    // First, try to extract text directly (for text-based PDFs)
    let extractedText = "";
    let totalChars = 0;

    for (let i = 1; i <= pageCount; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: unknown) => (item as { str: string }).str)
          .join(" ");
        extractedText += pageText + "\n\n";
        totalChars += pageText.length;
      } catch (pageError) {
        console.warn(`Error extracting page ${i}:`, pageError);
        // Continue with other pages
      }

      onProgress?.({
        stage: "extracting",
        progress: 10 + (i / pageCount) * 20,
        message: `Extraindo página ${i}/${pageCount}...`,
      });
    }

    // If we got enough text, it's a text-based PDF
    const avgCharsPerPage = totalChars / pageCount;
    const isScanned = avgCharsPerPage < 100; // Less than 100 chars per page suggests scanned

    if (!isScanned) {
      onProgress?.({
        stage: "complete",
        progress: 100,
        message: "Extração completa!",
      });

      return {
        text: cleanText(extractedText),
        isScanned: false,
        pageCount,
        fileType: "pdf",
      };
    }

    // It's a scanned PDF - use OCR
    onProgress?.({
      stage: "ocr",
      progress: 30,
      message: "PDF escaneado detectado. Iniciando OCR...",
    });

    // Create Tesseract worker
    let worker;
    try {
      worker = await Tesseract.createWorker("por+eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            const pageProgress = m.progress || 0;
            onProgress?.({
              stage: "ocr",
              progress: 30 + pageProgress * 60,
              message: `OCR em andamento: ${Math.round(pageProgress * 100)}%`,
            });
          }
        },
      });
    } catch (ocrError) {
      console.error("Tesseract init error:", ocrError);
      throw new Error(
        "Erro ao inicializar OCR. Tente novamente ou use um PDF com texto selecionável."
      );
    }

    let ocrText = "";
    let totalConfidence = 0;

    // Process each page with OCR
    for (let i = 1; i <= pageCount; i++) {
      try {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR

        // Create canvas to render the page
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        
        if (!context) {
          console.warn(`Could not get canvas context for page ${i}`);
          continue;
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Get image data from canvas
        const imageData = canvas.toDataURL("image/png");

        onProgress?.({
          stage: "ocr",
          progress: 30 + ((i - 1) / pageCount) * 60,
          message: `Processando página ${i}/${pageCount} com OCR...`,
        });

        // Run OCR on the page
        const result = await worker.recognize(imageData);
        ocrText += result.data.text + "\n\n";
        totalConfidence += result.data.confidence;
      } catch (pageOcrError) {
        console.warn(`OCR error on page ${i}:`, pageOcrError);
        // Continue with other pages
      }
    }

    await worker.terminate();

    if (!ocrText.trim()) {
      throw new Error(
        "Não foi possível extrair texto do PDF escaneado. Verifique a qualidade da imagem."
      );
    }

    onProgress?.({
      stage: "complete",
      progress: 100,
      message: "OCR completo!",
    });

    return {
      text: cleanText(ocrText),
      isScanned: true,
      pageCount,
      ocrConfidence: totalConfidence / pageCount,
      fileType: "pdf",
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw error instanceof Error
      ? error
      : new Error("Erro desconhecido ao processar o PDF.");
  }
}

/**
 * Clean and normalize extracted text
 */
function cleanText(text: string): string {
  return text
    // Remove excessive whitespace
    .replace(/\s+/g, " ")
    // Fix common OCR errors
    .replace(/\|/g, "l")
    .replace(/0(?=[a-zA-Z])/g, "O")
    // Normalize line breaks
    .replace(/\n\s*\n/g, "\n\n")
    // Trim
    .trim();
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// Re-export for backward compatibility
export type OCRProgress = ParseProgress;
export type OCRResult = ParseResult;
export const extractTextFromPDFLegacy = extractTextFromDocument;
export const isValidPDF = isValidDocument;
