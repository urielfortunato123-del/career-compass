import { useState } from "react";
import { FileText, Download, Eye, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResumeComparisonProps {
  originalResume?: {
    name: string;
    title: string;
    summary: string;
    experience: string[];
    skills: string[];
  };
  optimizedResume?: {
    name: string;
    title: string;
    summary: string;
    experience: string[];
    skills: string[];
    keywords: string[];
  };
}

export function ResumeComparison({
  originalResume = {
    name: "João Silva",
    title: "Desenvolvedor",
    summary: "Profissional da área de tecnologia com experiência em desenvolvimento de sistemas.",
    experience: [
      "Desenvolvedor na Empresa X - 2020 até hoje",
      "Trabalhei com várias tecnologias",
      "Participei de projetos importantes",
    ],
    skills: ["JavaScript", "React", "Node.js", "HTML", "CSS"],
  },
  optimizedResume = {
    name: "João Silva",
    title: "Desenvolvedor Frontend React | 4 anos de experiência",
    summary: "Desenvolvedor Frontend especializado em React com 4 anos de experiência construindo interfaces performáticas e acessíveis. Histórico comprovado de entregas em projetos de alta escala.",
    experience: [
      "Desenvolvedor Frontend Pleno | Empresa X | 2020 - Presente",
      "Desenvolvimento de interfaces React com TypeScript, reduzindo bugs em 40%",
      "Liderança técnica de 3 projetos com entregas dentro do prazo",
      "Implementação de testes automatizados aumentando cobertura de 20% para 80%",
    ],
    skills: ["React", "TypeScript", "JavaScript ES6+", "Node.js", "Testes Automatizados", "CI/CD"],
    keywords: ["React", "TypeScript", "Frontend", "Testes", "JavaScript", "Desenvolvimento Web"],
  },
}: Partial<ResumeComparisonProps>) {
  const [activeTab, setActiveTab] = useState("comparison");

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="comparison">Comparação</TabsTrigger>
          <TabsTrigger value="base">ATS Base</TabsTrigger>
          <TabsTrigger value="targeted">Direcionado</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original */}
            <div className="p-6 rounded-2xl bg-muted/50 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold">Currículo Original</h3>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Nome</p>
                  <p>{originalResume.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Título</p>
                  <p className="text-muted-foreground">{originalResume.title}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Resumo</p>
                  <p className="text-muted-foreground">{originalResume.summary}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Experiência</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {originalResume.experience.map((exp, i) => (
                      <li key={i}>{exp}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {originalResume.skills.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded-full bg-muted text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Optimized */}
            <div className="p-6 rounded-2xl bg-primary/5 border-2 border-primary/20 relative">
              <div className="absolute -top-3 right-4 px-3 py-1 rounded-full gradient-primary text-xs font-medium text-primary-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Otimizado
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary-foreground" />
                </div>
                <h3 className="font-semibold">Currículo ATS</h3>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Nome</p>
                  <p>{optimizedResume.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Título</p>
                  <p className="font-medium text-primary">{optimizedResume.title}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Resumo</p>
                  <p>{optimizedResume.summary}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Experiência</p>
                  <ul className="list-disc list-inside space-y-1">
                    {optimizedResume.experience.map((exp, i) => (
                      <li key={i}>{exp}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {optimizedResume.skills.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm font-medium mb-2">Palavras-chave ATS inseridas:</p>
            <div className="flex flex-wrap gap-2">
              {optimizedResume.keywords.map((keyword) => (
                <span 
                  key={keyword} 
                  className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="base">
          <div className="p-8 rounded-2xl bg-card border border-border text-center">
            <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Currículo ATS Base</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Versão otimizada para qualquer vaga da sua área.
              1 página, linguagem objetiva, foco em resultados.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline">
                <Eye className="w-4 h-4" />
                Visualizar
              </Button>
              <Button variant="default">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="targeted">
          <div className="p-8 rounded-2xl bg-card border border-border text-center">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Currículo Direcionado</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Ajustado especificamente para a vaga analisada.
              Skills reorganizadas, bullets reescritos, título ajustado.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline">
                <Eye className="w-4 h-4" />
                Visualizar
              </Button>
              <Button variant="hero">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
