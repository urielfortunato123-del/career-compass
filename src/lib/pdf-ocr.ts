import Tesseract from "tesseract.js";

// Dynamically import PDF.js to avoid top-level await issues
let pdfjsLib: typeof import("pdfjs-dist") | null = null;

async function getPdfjs() {
  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs`;
  }
  return pdfjsLib;
}

export interface OCRProgress {
  stage: "loading" | "extracting" | "ocr" | "complete";
  progress: number;
  message: string;
}

export interface OCRResult {
  text: string;
  isScanned: boolean;
  pageCount: number;
  ocrConfidence?: number;
}

/**
 * Extract text from a PDF file using pdf.js for text-based PDFs
 * and Tesseract.js OCR for scanned/image-based PDFs
 */
export async function extractTextFromPDF(
  file: File,
  onProgress?: (progress: OCRProgress) => void
): Promise<OCRResult> {
  onProgress?.({
    stage: "loading",
    progress: 0,
    message: "Carregando PDF...",
  });

  // Get PDF.js dynamically
  const pdfjs = await getPdfjs();
  
  // Load the PDF
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const pageCount = pdf.numPages;

  onProgress?.({
    stage: "extracting",
    progress: 10,
    message: "Extraindo texto...",
  });

  // First, try to extract text directly (for text-based PDFs)
  let extractedText = "";
  let totalChars = 0;

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    extractedText += pageText + "\n\n";
    totalChars += pageText.length;

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
    };
  }

  // It's a scanned PDF - use OCR
  onProgress?.({
    stage: "ocr",
    progress: 30,
    message: "PDF escaneado detectado. Iniciando OCR...",
  });

  // Create Tesseract worker
  const worker = await Tesseract.createWorker("por+eng", 1, {
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

  let ocrText = "";
  let totalConfidence = 0;

  // Process each page with OCR
  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR

    // Create canvas to render the page
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
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
  }

  await worker.terminate();

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
  };
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
 * Check if a file is a valid PDF
 */
export function isValidPDF(file: File): boolean {
  return (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
