import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ResumeUpload } from "@/components/app/ResumeUpload";
import { ResumeDataPreview } from "@/components/app/ResumeDataPreview";
import { JobAnalysis } from "@/components/app/JobAnalysis";
import { CompatibilityScore } from "@/components/app/CompatibilityScore";
import { ResumeComparison } from "@/components/app/ResumeComparison";
import { ActionPlan } from "@/components/app/ActionPlan";
import { CareerTransitionToggle } from "@/components/app/CareerTransitionToggle";
import { ResumeDownload } from "@/components/app/ResumeDownload";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, FileText, Search, BarChart3, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Step = "upload" | "job" | "results";

const steps = [
  { id: "upload" as const, label: "Currículo", icon: FileText },
  { id: "job" as const, label: "Vaga", icon: Search },
  { id: "results" as const, label: "Resultados", icon: BarChart3 },
];

export default function AppPage() {
  const { user, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [resumeData, setResumeData] = useState<{
    id: string;
    text: string;
    structuredData?: Record<string, unknown>;
  } | null>(null);
  const [jobAnalyzed, setJobAnalyzed] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string>("");

  const resumeUploaded = !!resumeData;

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    if (currentStep === "upload" && resumeUploaded) {
      setCurrentStep("job");
    } else if (currentStep === "job" && jobAnalyzed) {
      setCurrentStep("results");
    }
  };

  const prevStep = () => {
    if (currentStep === "job") setCurrentStep("upload");
    if (currentStep === "results") setCurrentStep("job");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 nebula-bg opacity-30 pointer-events-none" />
      <div className="fixed inset-0 gradient-hero pointer-events-none" />
      
      {/* Glow orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse-soft pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[100px] animate-pulse-soft pointer-events-none" style={{ animationDelay: '1s' }} />
      
      <Header />
      
      <main className="flex-1 py-8 pt-28 relative z-10">
        <div className="container max-w-4xl">
          {/* Step Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              {/* Progress Line Background */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-border/50" />
              
              {/* Progress Line Active */}
              <div 
                className="absolute top-5 left-0 h-0.5 transition-all duration-700 ease-out"
                style={{ 
                  width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                  background: 'linear-gradient(90deg, hsl(175 80% 45%), hsl(155 80% 50%))'
                }}
              />

              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;

                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      if (isCompleted) goToStep(step.id);
                    }}
                    className={`relative z-10 flex flex-col items-center transition-all duration-300 ${
                      isCompleted ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "gradient-primary text-primary-foreground shadow-glow scale-110"
                          : isCompleted
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "glass-card text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`mt-3 text-sm font-medium transition-colors ${
                        isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="animate-fade-in">
            {currentStep === "upload" && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    Passo 1 de 3
                  </div>
                  <h1 className="text-3xl font-bold mb-3">Envie seu currículo</h1>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Faça upload do seu PDF ou Word para começar a análise inteligente
                  </p>
                </div>

                <div className="glass-card rounded-3xl p-8 border border-border/50">
                  <ResumeUpload 
                    onUpload={(data) => {
                      setResumeData({
                        id: data.id,
                        text: data.text,
                        structuredData: data.structuredData,
                      });
                    }} 
                  />
                </div>
                
                <CareerTransitionToggle />

                {resumeData?.structuredData && (
                  <div className="glass-card rounded-2xl p-6 border border-primary/20">
                    <ResumeDataPreview data={resumeData.structuredData as Record<string, unknown>} />
                  </div>
                )}

                <div className="flex justify-end">
                  <Button 
                    variant="hero" 
                    size="lg"
                    disabled={!resumeUploaded}
                    onClick={nextStep}
                    className="shadow-glow"
                  >
                    Próximo: Informar Vaga
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === "job" && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    Passo 2 de 3
                  </div>
                  <h1 className="text-3xl font-bold mb-3">Analise a vaga</h1>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Cole o texto da vaga ou informe o cargo desejado
                  </p>
                </div>

                <div className="glass-card rounded-3xl p-8 border border-border/50">
                  <JobAnalysis onAnalyze={() => setJobAnalyzed(true)} />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" size="lg" onClick={prevStep} className="border-border/50">
                    <ArrowLeft className="w-5 h-5" />
                    Voltar
                  </Button>
                  <Button 
                    variant="hero" 
                    size="lg"
                    disabled={!jobAnalyzed}
                    onClick={nextStep}
                    className="shadow-glow"
                  >
                    Ver Resultados
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === "results" && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    Análise Completa
                  </div>
                  <h1 className="text-3xl font-bold mb-3">Seus Resultados</h1>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Score, currículo otimizado e plano de ação personalizado
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <div className="glass-card rounded-3xl p-6 border border-border/50">
                      <CompatibilityScore />
                    </div>
                  </div>
                  <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card rounded-3xl p-6 border border-border/50">
                      <ResumeComparison />
                    </div>
                    <div className="glass-card rounded-3xl p-6 border border-border/50">
                      <ActionPlan />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" size="lg" onClick={prevStep} className="border-border/50">
                    <ArrowLeft className="w-5 h-5" />
                    Voltar
                  </Button>
                  <ResumeDownload 
                    resumeContent={generatedResume || "# Currículo ATS\n\nGere seu currículo otimizado para visualizar aqui."} 
                    fileName={`curriculo-${user?.email?.split("@")[0] || "ats"}`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
