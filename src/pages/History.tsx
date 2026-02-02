import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  FileText, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  Download,
  Eye,
  Trash2,
  Loader2,
  Plus
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AnalysisRecord {
  id: string;
  score: number | null;
  created_at: string | null;
  job: {
    title: string;
    company: string | null;
  } | null;
}

export default function HistoryPage() {
  const { user, profile } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalyses();
    }
  }, [user]);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from("analyses")
        .select(`
          id,
          score,
          created_at,
          job:jobs(title, company)
        `)
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnalyses((data as unknown as AnalysisRecord[]) || []);
    } catch (error) {
      console.error("Error fetching analyses:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAnalysis = async (id: string) => {
    try {
      const { error } = await supabase
        .from("analyses")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setAnalyses(analyses.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting analysis:", error);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-danger";
  };

  const isPro = profile?.plan === "pro";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">Histórico de Análises</h1>
              <p className="text-muted-foreground">
                {analyses.length} {analyses.length === 1 ? "análise realizada" : "análises realizadas"}
              </p>
            </div>
            <Button variant="hero" asChild>
              <Link to="/app">
                <Plus className="w-4 h-4" />
                Nova Análise
              </Link>
            </Button>
          </div>

          {/* Usage Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile?.monthly_uploads_used || 0}</p>
                  <p className="text-xs text-muted-foreground">Uploads este mês</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile?.monthly_analyses_used || 0}</p>
                  <p className="text-xs text-muted-foreground">Análises este mês</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold capitalize">{profile?.plan || "free"}</p>
                  <p className="text-xs text-muted-foreground">Plano atual</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analyses List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Nenhuma análise ainda</h3>
              <p className="text-muted-foreground mb-6">
                Faça sua primeira análise de currículo e vaga
              </p>
              <Button variant="hero" asChild>
                <Link to="/app">Começar Agora</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <div 
                  key={analysis.id}
                  className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Score */}
                    <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
                      <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                        {analysis.score || "-"}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {analysis.job?.title || "Análise sem vaga"}
                      </h3>
                      {analysis.job?.company && (
                        <p className="text-sm text-muted-foreground truncate">
                          {analysis.job.company}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {analysis.created_at 
                            ? format(new Date(analysis.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })
                            : "Data não disponível"
                          }
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/analysis/${analysis.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      
                      {isPro ? (
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" disabled title="Disponível no plano Pro">
                          <Download className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteAnalysis(analysis.id)}
                      >
                        <Trash2 className="w-4 h-4 text-danger" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pro Upsell */}
          {!isPro && analyses.length > 0 && (
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Download className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Baixe seus currículos otimizados</h3>
                  <p className="text-sm text-muted-foreground">
                    Com o plano Pro você pode exportar seus currículos em PDF profissional.
                  </p>
                </div>
                <Button variant="hero" asChild>
                  <Link to="/#planos">Upgrade Pro</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
