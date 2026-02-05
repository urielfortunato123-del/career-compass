import { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle, Loader2, Lightbulb, GraduationCap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useImproveResume } from "@/hooks/useImproveResume";
import { Progress } from "@/components/ui/progress";

interface ResumeImproverProps {
  resumeData?: Record<string, unknown>;
  onImproved?: (result: any) => void;
}

export function ResumeImprover({ resumeData, onImproved }: ResumeImproverProps) {
  const [targetRole, setTargetRole] = useState("");
  const [targetArea, setTargetArea] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const { loading, result, improveResume } = useImproveResume();

  const handleImprove = async () => {
    if (!resumeData) return;

    const response = await improveResume({
      resume: resumeData,
      target_role: targetRole,
      target_area: targetArea,
      additional_details: additionalDetails,
    });

    if (response.data) {
      onImproved?.(response.data);
    }
  };

  if (result) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Score Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-muted/20 border border-border/30 text-center">
            <p className="text-sm text-muted-foreground mb-2">Score Anterior</p>
            <p className="text-3xl font-bold text-warning">{result.score_before}%</p>
          </div>
          <div className="p-5 rounded-2xl bg-success/10 border border-success/30 text-center">
            <p className="text-sm text-muted-foreground mb-2">Novo Score</p>
            <p className="text-3xl font-bold text-success">{result.score_after}%</p>
          </div>
        </div>

        {/* Improvements Made */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Melhorias Realizadas
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {result.improvements?.map((improvement: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-muted/20 border border-border/30">
                <p className="text-sm font-medium text-primary mb-2">{improvement.section}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-xs text-muted-foreground mb-1">Antes:</p>
                    <p className="text-muted-foreground line-through">{improvement.before}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-xs text-muted-foreground mb-1">Depois:</p>
                    <p>{improvement.after}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 italic">{improvement.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-warning" />
            Dicas para Entrevista
          </h3>
          <ul className="space-y-2">
            {result.tips?.map((tip: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Courses */}
        {result.suggested_courses?.length > 0 && (
          <div className="p-5 rounded-2xl bg-muted/20 border border-border/30">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-primary" />
              Cursos Sugeridos
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.suggested_courses.map((course: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm border border-primary/20"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
          <Sparkles className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold mb-2">Melhore seu Currículo com IA</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Nossa IA vai analisar e reescrever seu currículo para atingir no mínimo 95% de compatibilidade
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Cargo desejado</label>
          <Input
            placeholder="Ex: Desenvolvedor Frontend, Analista de Dados..."
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="bg-muted/20 border-border/50 focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Área de atuação</label>
          <Input
            placeholder="Ex: Tecnologia, Financeiro, Saúde..."
            value={targetArea}
            onChange={(e) => setTargetArea(e.target.value)}
            className="bg-muted/20 border-border/50 focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Detalhes adicionais (opcional)
          </label>
          <Textarea
            placeholder="Adicione informações que deseja destacar, novas habilidades, cursos recentes, conquistas..."
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            className="min-h-[100px] resize-none bg-muted/20 border-border/50 focus:border-primary"
          />
        </div>
      </div>

      {/* What will be improved */}
      <div className="p-5 rounded-2xl bg-muted/20 border border-border/30">
        <p className="text-sm font-medium mb-4">O que será melhorado:</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            "Título profissional",
            "Resumo executivo",
            "Descrição de experiências",
            "Skills e competências",
            "Palavras-chave ATS",
            "Formatação geral",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="hero"
        size="lg"
        className="w-full shadow-glow"
        onClick={handleImprove}
        disabled={loading || !resumeData || !targetRole}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Melhorando currículo...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Melhorar para 95%+
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </Button>
    </div>
  );
}
