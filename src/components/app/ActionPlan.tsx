import { useState } from "react";
import { Calendar, CheckCircle, Clock, BookOpen, Code, Send, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PlanPeriod = "14" | "30" | "90";

interface ActionItem {
  id: string;
  title: string;
  description: string;
  type: "course" | "project" | "application" | "interview";
  completed: boolean;
  week: number;
}

const samplePlan: Record<PlanPeriod, ActionItem[]> = {
  "14": [
    { id: "1", title: "Atualizar currículo ATS", description: "Aplicar ajustes recomendados pelo VagaJusta", type: "project", completed: true, week: 1 },
    { id: "2", title: "Enviar 10 candidaturas", description: "Foco em vagas com score acima de 70", type: "application", completed: false, week: 1 },
    { id: "3", title: "Curso de TypeScript básico", description: "4 horas no total - lacuna identificada", type: "course", completed: false, week: 1 },
    { id: "4", title: "Projeto mini: CRUD com TypeScript", description: "Demonstrar conhecimento prático", type: "project", completed: false, week: 2 },
    { id: "5", title: "Preparar para entrevista", description: "Estudar 5 perguntas frequentes", type: "interview", completed: false, week: 2 },
  ],
  "30": [
    { id: "1", title: "Atualizar currículo ATS", description: "Aplicar ajustes recomendados pelo VagaJusta", type: "project", completed: true, week: 1 },
    { id: "2", title: "Curso de TypeScript básico", description: "4 horas no total - lacuna identificada", type: "course", completed: false, week: 1 },
    { id: "3", title: "Enviar 20 candidaturas", description: "Semanas 1-2: foco em volume", type: "application", completed: false, week: 2 },
    { id: "4", title: "Projeto mini: API REST", description: "Node.js + TypeScript + testes", type: "project", completed: false, week: 2 },
    { id: "5", title: "Curso de testes automatizados", description: "6 horas - skill em alta demanda", type: "course", completed: false, week: 3 },
    { id: "6", title: "Projeto: adicionar testes ao portfolio", description: "Cobertura de 80%", type: "project", completed: false, week: 3 },
    { id: "7", title: "Simulado de entrevista", description: "10 perguntas técnicas + comportamentais", type: "interview", completed: false, week: 4 },
    { id: "8", title: "Acompanhar candidaturas", description: "Follow-up nas aplicações anteriores", type: "application", completed: false, week: 4 },
  ],
  "90": [
    { id: "1", title: "Fase 1: Fundação (semanas 1-4)", description: "Currículo + skills básicas + primeiras candidaturas", type: "project", completed: false, week: 1 },
    { id: "2", title: "Fase 2: Especialização (semanas 5-8)", description: "Cursos avançados + projetos de portfolio", type: "course", completed: false, week: 5 },
    { id: "3", title: "Fase 3: Intensificação (semanas 9-12)", description: "40+ candidaturas + entrevistas + networking", type: "application", completed: false, week: 9 },
  ],
};

const typeIcons = {
  course: BookOpen,
  project: Code,
  application: Send,
  interview: MessageSquare,
};

const typeColors = {
  course: "text-primary bg-primary/10 border-primary/20",
  project: "text-accent bg-accent/10 border-accent/20",
  application: "text-success bg-success/10 border-success/20",
  interview: "text-warning bg-warning/10 border-warning/20",
};

export function ActionPlan() {
  const [period, setPeriod] = useState<PlanPeriod>("14");
  const [items, setItems] = useState(samplePlan);

  const toggleItem = (itemId: string) => {
    setItems((prev) => ({
      ...prev,
      [period]: prev[period].map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  const completedCount = items[period].filter((i) => i.completed).length;
  const totalCount = items[period].length;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <div className="w-full">
      {/* Period Selector */}
      <Tabs value={period} onValueChange={(v) => setPeriod(v as PlanPeriod)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/30 p-1">
          <TabsTrigger value="14" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Calendar className="w-4 h-4" />
            14 dias
          </TabsTrigger>
          <TabsTrigger value="30" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Calendar className="w-4 h-4" />
            30 dias
          </TabsTrigger>
          <TabsTrigger value="90" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Calendar className="w-4 h-4" />
            90 dias
          </TabsTrigger>
        </TabsList>

        {/* Progress Bar */}
        <div className="mb-6 p-4 rounded-xl bg-muted/20 border border-border/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Progresso do plano
            </span>
            <span className="text-sm text-muted-foreground">
              {completedCount}/{totalCount} tarefas
            </span>
          </div>
          <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-700 shadow-glow"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Items */}
        {(["14", "30", "90"] as PlanPeriod[]).map((p) => (
          <TabsContent key={p} value={p} className="space-y-3">
            {items[p].map((item) => {
              const Icon = typeIcons[item.type];
              const colorClass = typeColors[item.type];

              return (
                <div
                  key={item.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
                    item.completed
                      ? "bg-muted/20 border-border/30 opacity-70"
                      : "bg-muted/10 border-border/30 hover:border-primary/30 hover:bg-muted/20"
                  }`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                      item.completed
                        ? "bg-success border-success shadow-[0_0_10px_hsl(155_75%_50%/0.3)]"
                        : "border-muted-foreground/50 hover:border-primary hover:bg-primary/10"
                    }`}
                  >
                    {item.completed && (
                      <CheckCircle className="w-4 h-4 text-success-foreground" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`p-1.5 rounded-lg border ${colorClass}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <h4
                        className={`font-medium text-sm ${
                          item.completed ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-1 text-xs text-muted-foreground px-2 py-1 rounded-lg bg-muted/30">
                    <Clock className="w-3 h-3" />
                    Sem {item.week}
                  </div>
                </div>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>

      {/* Download/Export */}
      <div className="mt-6 flex justify-center">
        <Button variant="outline" className="border-border/50">
          <Calendar className="w-4 h-4 mr-2" />
          Exportar para agenda
        </Button>
      </div>
    </div>
  );
}
