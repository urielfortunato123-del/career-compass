import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";

interface ScoreBreakdown {
  label: string;
  score: number;
  weight: string;
}

interface CompatibilityScoreProps {
  currentScore: number;
  potentialScore: number;
  breakdown: ScoreBreakdown[];
  improvements: string[];
}

export function CompatibilityScore({
  currentScore = 67,
  potentialScore = 85,
  breakdown = [
    { label: "Aderência técnica", score: 75, weight: "Alta" },
    { label: "Senioridade", score: 60, weight: "Média" },
    { label: "Palavras-chave ATS", score: 55, weight: "Alta" },
    { label: "Estrutura do currículo", score: 80, weight: "Média" },
  ],
  improvements = [
    "Adicionar experiência com testes automatizados",
    "Incluir certificação em metodologias ágeis",
    "Destacar projetos com métricas de resultado",
  ],
}: Partial<CompatibilityScoreProps>) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-danger";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-warning";
    return "bg-danger";
  };

  const getTrend = () => {
    const diff = potentialScore - currentScore;
    if (diff > 10) return { icon: TrendingUp, color: "text-success", text: `+${diff} pontos possíveis` };
    if (diff > 0) return { icon: TrendingUp, color: "text-warning", text: `+${diff} pontos possíveis` };
    return { icon: Minus, color: "text-muted-foreground", text: "Score otimizado" };
  };

  const trend = getTrend();

  return (
    <div className="w-full">
      {/* Main Score Display */}
      <div className="text-center p-8 rounded-2xl bg-card border border-border mb-6">
        <p className="text-sm text-muted-foreground mb-2">Score de Empregabilidade</p>
        
        <div className="relative inline-flex items-center justify-center mb-4">
          {/* Circular progress indicator */}
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              className="fill-none stroke-muted"
              strokeWidth="12"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              className={`fill-none ${getScoreBg(currentScore).replace('bg-', 'stroke-')}`}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(currentScore / 100) * 440} 440`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold ${getScoreColor(currentScore)}`}>
              {currentScore}
            </span>
            <span className="text-sm text-muted-foreground">de 100</span>
          </div>
        </div>

        {/* Potential score indicator */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <trend.icon className={`w-4 h-4 ${trend.color}`} />
          <span className={trend.color}>{trend.text}</span>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="p-6 rounded-2xl bg-card border border-border mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          Detalhamento do Score
          <Info className="w-4 h-4 text-muted-foreground" />
        </h3>
        
        <div className="space-y-4">
          {breakdown.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Peso: {item.weight}</span>
                  <span className={`text-sm font-medium ${getScoreColor(item.score)}`}>
                    {item.score}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getScoreBg(item.score)}`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvements */}
      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          O que aumenta seu score
        </h3>
        
        <ul className="space-y-3">
          {improvements.map((improvement, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full gradient-primary text-xs font-bold text-primary-foreground flex items-center justify-center">
                {index + 1}
              </span>
              <span className="text-sm">{improvement}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
