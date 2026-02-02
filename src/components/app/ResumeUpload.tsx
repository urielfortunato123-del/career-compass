import { useState, useCallback } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeUploadProps {
  onUpload?: (file: File) => void;
}

export function ResumeUpload({ onUpload }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files?.[0]?.type === "application/pdf") {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      processFile(files[0]);
    }
  }, []);

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setUploadStatus("uploading");
    
    // Simulate upload process
    setTimeout(() => {
      setUploadStatus("success");
      onUpload?.(selectedFile);
    }, 1500);
  };

  const removeFile = () => {
    setFile(null);
    setUploadStatus("idle");
  };

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
              {uploadStatus === "success" ? (
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
                {uploadStatus === "uploading" && "Processando..."}
                {uploadStatus === "success" && "Currículo carregado com sucesso!"}
                {uploadStatus === "error" && "Erro ao processar arquivo"}
              </p>
            </div>

            <button
              onClick={removeFile}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {uploadStatus === "uploading" && (
            <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full gradient-primary rounded-full animate-pulse" style={{ width: "60%" }} />
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-4">
        📄 PDFs textuais ou escaneados são aceitos. OCR automático quando necessário.
      </p>
    </div>
  );
}
