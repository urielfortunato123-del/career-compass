import { useState } from "react";
import { RefreshCw, ArrowRight, Briefcase, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface CareerTransitionToggleProps {
  onToggle?: (enabled: boolean, targetArea?: string) => void;
}

export function CareerTransitionToggle({ onToggle }: CareerTransitionToggleProps) {
  const [enabled, setEnabled] = useState(false);
  const [targetArea, setTargetArea] = useState("");

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    onToggle?.(checked, targetArea);
  };

  const handleAreaChange = (area: string) => {
    setTargetArea(area);
    if (enabled) {
      onToggle?.(enabled, area);
    }
  };

  return (
    <div className={`glass-card p-6 rounded-2xl border-2 transition-all duration-300 ${
      enabled 
        ? "border-primary bg-primary/5 shadow-glow" 
        : "border-border/50"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
            enabled ? "gradient-primary shadow-glow" : "bg-muted/50"
          }`}>
            <RefreshCw className={`w-6 h-6 ${enabled ? "text-primary-foreground" : "text-muted-foreground"}`} />
          </div>
          <div>
            <h3 className="font-semibold">Modo Transição de Carreira</h3>
            <p className="text-sm text-muted-foreground">
              Ative se você quer mudar de área
            </p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={handleToggle} />
      </div>

      {enabled && (
        <div className="mt-6 pt-6 border-t border-border/30 animate-fade-in">
          <label className="text-sm font-medium mb-3 block flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Para qual área você quer migrar?
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground px-3 py-2 rounded-lg bg-muted/30">
              <Briefcase className="w-4 h-4" />
              <span>Atual</span>
            </div>
            <ArrowRight className="w-5 h-5 text-primary" />
            <Input
              placeholder="Ex: Dados, DevOps, Produto..."
              value={targetArea}
              onChange={(e) => handleAreaChange(e.target.value)}
              className="flex-1 bg-muted/20 border-border/50 focus:border-primary"
            />
          </div>

          <div className="mt-5 p-4 rounded-xl bg-muted/20 border border-border/30">
            <p className="font-medium mb-3 text-sm">O que muda no seu currículo:</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Título híbrido (ex: "QA em transição para Dados")
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Experiências anteriores traduzidas para nova área
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Projetos pessoais ganham prioridade
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Menos peso para cargos antigos não relacionados
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
