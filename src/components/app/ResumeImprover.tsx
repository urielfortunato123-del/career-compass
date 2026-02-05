import { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle, Loader2, Lightbulb, GraduationCap, TrendingUp, Rocket, AlertCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useImproveResume } from "@/hooks/useImproveResume";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ResumeImproverProps {
  resumeData?: Record<string, unknown>;
  onImproved?: (result: any) => void;
}

export function ResumeImprover({ resumeData, onImproved }: ResumeImproverProps) {
  const [targetRole, setTargetRole] = useState("");
  const [targetArea, setTargetArea] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [careerTransition, setCareerTransition] = useState(false);
  const { loading, result, improveResume } = useImproveResume();

  const handleImprove = async () => {
    if (!resumeData) return;

    const response = await improveResume({
      resume: resumeData,
      target_role: targetRole,
      target_area: targetArea,
      additional_details: additionalDetails,
      career_transition: careerTransition,
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

        {/* Career Transition Analysis */}
        {result.is_career_transition && result.transition_analysis && (
          <div className="p-5 rounded-2xl bg-primary/10 border border-primary/30 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              Análise de Transição de Carreira
            </h3>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant={result.transition_analysis.experience_level === 'none' ? 'secondary' : 'default'}>
                {result.transition_analysis.experience_level === 'none' && '🌱 Iniciante Completo'}
                {result.transition_analysis.experience_level === 'learning' && '📚 Em Formação'}
                {result.transition_analysis.experience_level === 'some' && '💼 Alguma Experiência'}
              </Badge>
              {result.transition_analysis.has_courses && (
                <Badge variant="outline" className="bg-success/10 border-success/30">
                  ✓ Possui cursos na área
                </Badge>
              )}
            </div>

            {result.transition_analysis.recommended_title && (
              <div className="p-3 rounded-lg bg-background/50">
                <p className="text-xs text-muted-foreground mb-1">Título Sugerido:</p>
                <p className="font-medium text-primary">{result.transition_analysis.recommended_title}</p>
              </div>
            )}

            <p className="text-sm text-muted-foreground italic">
              {result.transition_analysis.honest_assessment}
            </p>

            {result.transition_analysis.transferable_skills?.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Skills Transferíveis:</p>
                <div className="flex flex-wrap gap-1">
                  {result.transition_analysis.transferable_skills.map((skill: string, i: number) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-muted/50 text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Entry Strategy for Career Transition */}
        {result.entry_strategy && (
          <div className="p-5 rounded-2xl bg-warning/10 border border-warning/30">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-warning" />
              Estratégia de Entrada
            </h3>
            <p className="text-sm">{result.entry_strategy}</p>
          </div>
        )}

        {/* Improvements Made */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            {result.is_career_transition ? 'Reconstrução do Currículo' : 'Melhorias Realizadas'}
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
            {result.is_career_transition ? 'Dicas para Iniciantes' : 'Dicas para Entrevista'}
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

        {/* Missing Skills */}
        {result.missing_skills?.length > 0 && (
          <div className="p-5 rounded-2xl bg-warning/10 border border-warning/30">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-warning" />
              Skills que Você Precisa Desenvolver
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.missing_skills.map((skill: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-warning/20 text-warning-foreground text-sm border border-warning/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Courses */}
        {result.suggested_courses?.length > 0 && (
          <div className="p-5 rounded-2xl bg-muted/20 border border-border/30">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-primary" />
              {result.is_career_transition ? 'Cursos Prioritários' : 'Cursos Sugeridos'}
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

      {/* Career Transition Toggle */}
      <div className="p-5 rounded-2xl bg-primary/10 border border-primary/30">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              <span className="font-medium">Transição de Carreira</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {careerTransition 
                ? "A IA vai RECONSTRUIR seu currículo para a nova área, removendo experiências irrelevantes"
                : "A IA vai MELHORAR seu currículo na mesma área de atuação"
              }
            </p>
          </div>
          <Switch
            checked={careerTransition}
            onCheckedChange={setCareerTransition}
          />
        </div>
      </div>

      {/* What will be improved */}
      <div className="p-5 rounded-2xl bg-muted/20 border border-border/30">
        <p className="text-sm font-medium mb-4">
          {careerTransition ? "O que será feito:" : "O que será melhorado:"}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(careerTransition ? [
            "Análise de nível",
            "Título adaptado",
            "Remoção de irrelevantes",
            "Foco em potencial",
            "Skills transferíveis",
            "Estratégia de entrada",
          ] : [
            "Título profissional",
            "Resumo executivo",
            "Descrição de experiências",
            "Skills e competências",
            "Palavras-chave ATS",
            "Formatação geral",
          ]).map((item) => (
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
            {careerTransition ? "Reconstruindo currículo..." : "Melhorando currículo..."}
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            {careerTransition ? "Reconstruir para Nova Área" : "Melhorar para 95%+"}
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </Button>
    </div>
  );
}
