import { useState } from "react";
import { Search, Briefcase, AlertTriangle, CheckCircle, XCircle, Sparkles } from "lucide-react";
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
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setMode("text")}
          className={`flex-1 p-5 rounded-2xl border-2 transition-all duration-300 ${
            mode === "text" 
              ? "border-primary bg-primary/10 shadow-glow" 
              : "border-border/50 hover:border-primary/30 bg-muted/20"
          }`}
        >
          <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
            mode === "text" ? "gradient-primary" : "bg-muted/50"
          }`}>
            <Search className={`w-6 h-6 ${mode === "text" ? "text-primary-foreground" : "text-muted-foreground"}`} />
          </div>
          <p className={`text-sm font-medium ${mode === "text" ? "text-primary" : "text-muted-foreground"}`}>
            Colar texto da vaga
          </p>
        </button>
        
        <button
          onClick={() => setMode("title")}
          className={`flex-1 p-5 rounded-2xl border-2 transition-all duration-300 ${
            mode === "title" 
              ? "border-primary bg-primary/10 shadow-glow" 
              : "border-border/50 hover:border-primary/30 bg-muted/20"
          }`}
        >
          <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
            mode === "title" ? "gradient-primary" : "bg-muted/50"
          }`}>
            <Briefcase className={`w-6 h-6 ${mode === "title" ? "text-primary-foreground" : "text-muted-foreground"}`} />
          </div>
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
          className="min-h-[200px] resize-none bg-muted/20 border-border/50 focus:border-primary"
        />
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Cargo desejado</label>
            <Input
              placeholder="Ex: Analista de QA, Desenvolvedor Frontend..."
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="bg-muted/20 border-border/50 focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Área (opcional)</label>
            <Input
              placeholder="Ex: Tecnologia, Dados, Financeiro..."
              value={jobArea}
              onChange={(e) => setJobArea(e.target.value)}
              className="bg-muted/20 border-border/50 focus:border-primary"
            />
          </div>
        </div>
      )}

      {/* Analysis Preview */}
      <div className="mt-8 p-5 rounded-2xl bg-muted/20 border border-border/30">
        <p className="text-sm font-medium mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          O que será analisado:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/20">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm">Skills obrigatórias</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/20">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm">Senioridade implícita</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/20">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm">Palavras-chave ATS</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-warning/5 border border-warning/20">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-sm">Sinais de risco</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-destructive/5 border border-destructive/20">
            <XCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm">Detector de cilada</span>
          </div>
        </div>
      </div>

      <Button 
        variant="hero" 
        size="lg" 
        className="w-full mt-8 shadow-glow"
        disabled={!isValid}
        onClick={handleAnalyze}
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Analisar Vaga
      </Button>
    </div>
  );
}
