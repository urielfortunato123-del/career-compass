import { useState } from "react";
import { FileText, Download, Eye, Sparkles } from "lucide-react";
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
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/30 p-1">
          <TabsTrigger value="comparison" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Comparação
          </TabsTrigger>
          <TabsTrigger value="base" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            ATS Base
          </TabsTrigger>
          <TabsTrigger value="targeted" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Direcionado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original */}
            <div className="p-6 rounded-2xl bg-muted/20 border border-border/30">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-muted-foreground" />
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
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {originalResume.skills.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 rounded-lg bg-muted/50 text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Optimized */}
            <div className="p-6 rounded-2xl bg-primary/5 border-2 border-primary/20 relative">
              <div className="absolute -top-3 right-4 px-3 py-1 rounded-full gradient-primary text-xs font-medium text-primary-foreground flex items-center gap-1 shadow-glow">
                <Sparkles className="w-3 h-3" />
                Otimizado
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                  <FileText className="w-5 h-5 text-primary-foreground" />
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
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {optimizedResume.skills.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium border border-primary/30">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="p-5 rounded-xl bg-muted/20 border border-border/30">
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-success" />
              Palavras-chave ATS inseridas:
            </p>
            <div className="flex flex-wrap gap-2">
              {optimizedResume.keywords.map((keyword) => (
                <span 
                  key={keyword} 
                  className="px-3 py-1.5 rounded-lg bg-success/10 text-success text-sm font-medium border border-success/20"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="base">
          <div className="p-10 rounded-2xl bg-muted/20 border border-border/30 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-5">
              <Eye className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Currículo ATS Base</h3>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
              Versão otimizada para qualquer vaga da sua área.
              1 página, linguagem objetiva, foco em resultados.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" className="border-border/50">
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
              <Button variant="default">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="targeted">
          <div className="p-10 rounded-2xl bg-primary/5 border border-primary/20 text-center">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5 shadow-glow">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Currículo Direcionado</h3>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
              Ajustado especificamente para a vaga analisada.
              Skills reorganizadas, bullets reescritos, título ajustado.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" className="border-border/50">
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
              <Button variant="hero" className="shadow-glow">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
