import { TrendingUp, TrendingDown, Minus, Info, Sparkles } from "lucide-react";

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
    return "text-destructive";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-success to-primary";
    if (score >= 60) return "from-warning to-primary";
    return "from-destructive to-warning";
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
      <div className="text-center p-6 mb-6">
        <p className="text-sm text-muted-foreground mb-4">Score de Empregabilidade</p>
        
        <div className="relative inline-flex items-center justify-center mb-6">
          {/* Circular progress indicator */}
          <svg className="w-44 h-44 transform -rotate-90">
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(175 80% 45%)" />
                <stop offset="100%" stopColor="hsl(155 80% 50%)" />
              </linearGradient>
            </defs>
            <circle
              cx="88"
              cy="88"
              r="78"
              className="fill-none stroke-muted/30"
              strokeWidth="10"
            />
            <circle
              cx="88"
              cy="88"
              r="78"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(currentScore / 100) * 490} 490`}
              className="drop-shadow-[0_0_10px_hsl(175_80%_45%/0.5)]"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold text-gradient`}>
              {currentScore}
            </span>
            <span className="text-sm text-muted-foreground">de 100</span>
          </div>
        </div>

        {/* Potential score indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 text-sm">
          <trend.icon className={`w-4 h-4 ${trend.color}`} />
          <span className={trend.color}>{trend.text}</span>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="p-5 rounded-2xl bg-muted/20 border border-border/30 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
          Detalhamento do Score
          <Info className="w-4 h-4 text-muted-foreground" />
        </h3>
        
        <div className="space-y-4">
          {breakdown.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted/50">
                    {item.weight}
                  </span>
                  <span className={`text-sm font-semibold ${getScoreColor(item.score)}`}>
                    {item.score}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${getScoreGradient(item.score)}`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improvements */}
      <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20">
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          O que aumenta seu score
        </h3>
        
        <ul className="space-y-3">
          {improvements.map((improvement, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-lg gradient-primary text-xs font-bold text-primary-foreground flex items-center justify-center shadow-glow">
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
