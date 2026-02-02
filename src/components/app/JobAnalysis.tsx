import { useState } from "react";
import { Search, Briefcase, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type AnalysisMode = "text" | "title";

interface JobAnalysisProps {
  onAnalyze?: (data: { mode: AnalysisMode; content: string; area?: string }) => void;
}

export function JobAnalysis({ onAnalyze }: JobAnalysisProps) {
  const [mode, setMode] = useState<AnalysisMode>("text");
  const [jobText, setJobText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobArea, setJobArea] = useState("");

  const handleAnalyze = () => {
    if (mode === "text" && jobText.trim()) {
      onAnalyze?.({ mode, content: jobText });
    } else if (mode === "title" && jobTitle.trim()) {
      onAnalyze?.({ mode, content: jobTitle, area: jobArea });
    }
  };

  const isValid = mode === "text" ? jobText.trim().length > 50 : jobTitle.trim().length > 0;

  return (
    <div className="w-full">
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("text")}
          className={`flex-1 p-4 rounded-xl border-2 transition-all ${
            mode === "text" 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/30"
          }`}
        >
          <Search className={`w-5 h-5 mx-auto mb-2 ${mode === "text" ? "text-primary" : "text-muted-foreground"}`} />
          <p className={`text-sm font-medium ${mode === "text" ? "text-primary" : "text-muted-foreground"}`}>
            Colar texto da vaga
          </p>
        </button>
        
        <button
          onClick={() => setMode("title")}
          className={`flex-1 p-4 rounded-xl border-2 transition-all ${
            mode === "title" 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/30"
          }`}
        >
          <Briefcase className={`w-5 h-5 mx-auto mb-2 ${mode === "title" ? "text-primary" : "text-muted-foreground"}`} />
          <p className={`text-sm font-medium ${mode === "title" ? "text-primary" : "text-muted-foreground"}`}>
            Informar cargo + área
          </p>
        </button>
      </div>

      {/* Input Fields */}
      {mode === "text" ? (
        <Textarea
          placeholder="Cole aqui o texto completo da vaga. Quanto mais detalhes, melhor a análise..."
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          className="min-h-[200px] resize-none"
        />
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Cargo desejado</label>
            <Input
              placeholder="Ex: Analista de QA, Desenvolvedor Frontend..."
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Área (opcional)</label>
            <Input
              placeholder="Ex: Tecnologia, Dados, Financeiro..."
              value={jobArea}
              onChange={(e) => setJobArea(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Analysis Preview */}
      <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-sm font-medium mb-3">O que será analisado:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-success" />
            <span>Skills obrigatórias</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-success" />
            <span>Senioridade implícita</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-success" />
            <span>Palavras-chave ATS</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span>Sinais de risco</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <XCircle className="w-4 h-4 text-danger" />
            <span>Detector de cilada</span>
          </div>
        </div>
      </div>

      <Button 
        variant="hero" 
        size="lg" 
        className="w-full mt-6"
        disabled={!isValid}
        onClick={handleAnalyze}
      >
        Analisar Vaga
      </Button>
    </div>
  );
}
