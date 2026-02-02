import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ResumeUpload } from "@/components/app/ResumeUpload";
import { JobAnalysis } from "@/components/app/JobAnalysis";
import { CompatibilityScore } from "@/components/app/CompatibilityScore";
import { ResumeComparison } from "@/components/app/ResumeComparison";
import { ActionPlan } from "@/components/app/ActionPlan";
import { CareerTransitionToggle } from "@/components/app/CareerTransitionToggle";
import { ResumeDownload } from "@/components/app/ResumeDownload";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, FileText, Search, BarChart3 } from "lucide-react";
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
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [jobAnalyzed, setJobAnalyzed] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string>("");

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
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
              <div 
                className="absolute top-5 left-0 h-0.5 gradient-primary transition-all duration-500"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
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
                    className={`relative z-10 flex flex-col items-center transition-all ${
                      isCompleted ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? "gradient-primary text-primary-foreground shadow-glow"
                          : isCompleted
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
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
                  <h1 className="text-2xl font-bold mb-2">Envie seu currículo</h1>
                  <p className="text-muted-foreground">
                    Faça upload do seu PDF para começar a análise
                  </p>
                </div>

                <ResumeUpload onUpload={() => setResumeUploaded(true)} />
                
                <CareerTransitionToggle />

                <div className="flex justify-end">
                  <Button 
                    variant="hero" 
                    size="lg"
                    disabled={!resumeUploaded}
                    onClick={nextStep}
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
                  <h1 className="text-2xl font-bold mb-2">Analise a vaga</h1>
                  <p className="text-muted-foreground">
                    Cole o texto da vaga ou informe o cargo desejado
                  </p>
                </div>

                <JobAnalysis onAnalyze={() => setJobAnalyzed(true)} />

                <div className="flex justify-between">
                  <Button variant="outline" size="lg" onClick={prevStep}>
                    <ArrowLeft className="w-5 h-5" />
                    Voltar
                  </Button>
                  <Button 
                    variant="hero" 
                    size="lg"
                    disabled={!jobAnalyzed}
                    onClick={nextStep}
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
                  <h1 className="text-2xl font-bold mb-2">Seus Resultados</h1>
                  <p className="text-muted-foreground">
                    Score, currículo otimizado e plano de ação
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <CompatibilityScore />
                  </div>
                  <div className="lg:col-span-2 space-y-8">
                    <ResumeComparison />
                    <ActionPlan />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" size="lg" onClick={prevStep}>
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
