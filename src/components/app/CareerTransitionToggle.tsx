import { useState } from "react";
import { RefreshCw, ArrowRight, Briefcase } from "lucide-react";
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
    <div className={`p-6 rounded-2xl border-2 transition-all ${
      enabled 
        ? "border-primary bg-primary/5" 
        : "border-border bg-card"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            enabled ? "gradient-primary" : "bg-muted"
          }`}>
            <RefreshCw className={`w-5 h-5 ${enabled ? "text-primary-foreground" : "text-muted-foreground"}`} />
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
        <div className="mt-4 pt-4 border-t border-border animate-fade-in">
          <label className="text-sm font-medium mb-2 block">
            Para qual área você quer migrar?
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="w-4 h-4" />
              <span>Atual</span>
            </div>
            <ArrowRight className="w-4 h-4 text-primary" />
            <Input
              placeholder="Ex: Dados, DevOps, Produto..."
              value={targetArea}
              onChange={(e) => handleAreaChange(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm">
            <p className="font-medium mb-2">O que muda no seu currículo:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Título híbrido (ex: "QA em transição para Dados")</li>
              <li>• Experiências anteriores traduzidas para nova área</li>
              <li>• Projetos pessoais ganham prioridade</li>
              <li>• Menos peso para cargos antigos não relacionados</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
