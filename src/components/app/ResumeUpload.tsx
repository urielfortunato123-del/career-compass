import { useState, useCallback } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle, ScanLine, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePDFParser } from "@/hooks/usePDFParser";
import { formatFileSize } from "@/lib/pdf-ocr";

interface ResumeUploadProps {
  onUpload?: (data: { 
    id: string;
    file: File; 
    text: string; 
    structuredData?: Record<string, unknown>;
  }) => void;
}

export function ResumeUpload({ onUpload }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { parseResume, loading, progress, result, reset } = usePDFParser();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files?.[0]?.type === "application/pdf") {
      await processFile(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      await processFile(files[0]);
    }
  }, []);

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    
    const parsed = await parseResume(selectedFile);
    
    if (parsed) {
      onUpload?.({
        id: parsed.id,
        file: selectedFile,
        text: parsed.text,
        structuredData: parsed.structuredData,
      });
    }
  };

  const removeFile = () => {
    setFile(null);
    reset();
  };

  const uploadStatus = loading ? "uploading" : result ? "success" : file ? "error" : "idle";

  return (
    <div className="w-full">
      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
              isDragging ? "gradient-primary" : "bg-primary/10"
            }`}>
              <Upload className={`w-8 h-8 ${isDragging ? "text-primary-foreground" : "text-primary"}`} />
            </div>
            
            <div>
              <p className="font-semibold mb-1">
                Arraste seu currículo aqui
              </p>
              <p className="text-sm text-muted-foreground">
                ou clique para selecionar (PDF)
              </p>
            </div>

            <Button variant="outline" size="sm" className="pointer-events-none">
              Selecionar arquivo
            </Button>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              uploadStatus === "success" ? "bg-success/10" : 
              uploadStatus === "error" ? "bg-danger/10" : "bg-primary/10"
            }`}>
              {loading ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : uploadStatus === "success" ? (
                <CheckCircle className="w-6 h-6 text-success" />
              ) : uploadStatus === "error" ? (
                <AlertCircle className="w-6 h-6 text-danger" />
              ) : (
                <FileText className="w-6 h-6 text-primary" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(file.size)}
                {result?.isScanned && (
                  <span className="ml-2 inline-flex items-center gap-1 text-warning">
                    <ScanLine className="w-3 h-3" />
                    OCR aplicado
                  </span>
                )}
              </p>
              {loading && progress && (
                <p className="text-xs text-primary mt-1">{progress.message}</p>
              )}
              {result && (
                <p className="text-xs text-success mt-1">
                  ✓ {result.pageCount} página(s) processada(s)
                  {result.ocrConfidence && ` • ${Math.round(result.ocrConfidence)}% confiança OCR`}
                </p>
              )}
            </div>

            <button
              onClick={removeFile}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {loading && progress && (
            <div className="mt-4 space-y-2">
              <Progress value={progress.progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{progress.stage === "ocr" ? "🔍 OCR Tesseract" : "📄 Extração"}</span>
                <span>{Math.round(progress.progress)}%</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          PDFs textuais
        </span>
        <span className="flex items-center gap-1">
          <ScanLine className="w-3 h-3" />
          PDFs escaneados (OCR)
        </span>
      </div>
    </div>
  );
}
