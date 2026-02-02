import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  User, 
  Briefcase, 
  Target, 
  DollarSign, 
  Clock, 
  MapPin,
  Save,
  ArrowLeft,
  Sparkles,
  Crown
} from "lucide-react";

type WorkPreferences = {
  remote: boolean;
  hybrid: boolean;
  onsite: boolean;
  clt: boolean;
  pj: boolean;
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, profile, updateProfile, subscription } = useAuth();
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [currentArea, setCurrentArea] = useState("");
  const [targetArea, setTargetArea] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"junior" | "pleno" | "senior">("junior");
  const [salaryMinimum, setSalaryMinimum] = useState<number | undefined>();
  const [dailyAvailability, setDailyAvailability] = useState(2);
  const [careerTransition, setCareerTransition] = useState(false);
  const [workPreferences, setWorkPreferences] = useState<WorkPreferences>({
    remote: true,
    hybrid: false,
    onsite: false,
    clt: true,
    pj: true,
  });

  // Load profile data
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setCurrentArea(profile.current_area || "");
      setTargetArea(profile.target_area || "");
      setExperienceLevel(profile.experience_level || "junior");
      setSalaryMinimum(profile.salary_minimum || undefined);
      setDailyAvailability(profile.daily_availability_hours || 2);
      setCareerTransition(profile.career_transition || false);
      if (profile.work_preferences) {
        setWorkPreferences(profile.work_preferences as WorkPreferences);
      }
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    
    const updates = {
      name: name.trim(),
      current_area: currentArea.trim(),
      target_area: targetArea.trim(),
      experience_level: experienceLevel,
      salary_minimum: salaryMinimum || null,
      daily_availability_hours: dailyAvailability,
      career_transition: careerTransition,
      work_preferences: workPreferences,
      updated_at: new Date().toISOString(),
    };

    const { error } = await updateProfile(updates);
    
    if (error) {
      toast.error("Erro ao salvar configurações", {
        description: error.message,
      });
    } else {
      toast.success("Configurações salvas com sucesso!");
    }
    
    setSaving(false);
  };

  const areas = [
    "Tecnologia",
    "Marketing",
    "Vendas",
    "Recursos Humanos",
    "Finanças",
    "Operações",
    "Design",
    "Produto",
    "Dados",
    "Engenharia",
    "Jurídico",
    "Administrativo",
    "Outro",
  ];

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
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/app")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao App
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Configurações do Perfil
                </h1>
                <p className="text-muted-foreground">
                  Personalize suas preferências de carreira
                </p>
              </div>
              
              {subscription.plan === "pro" && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 text-sm font-medium">
                  <Crown className="w-4 h-4" />
                  Pro
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Dados Pessoais */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Dados Pessoais
                </CardTitle>
                <CardDescription>
                  Informações básicas do seu perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted/30 text-muted-foreground"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Área de Atuação */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Área de Atuação
                </CardTitle>
                <CardDescription>
                  Defina sua área atual e área de interesse
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentArea">Área Atual</Label>
                    <Select value={currentArea} onValueChange={setCurrentArea}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Selecione sua área" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetArea">Área Desejada</Label>
                    <Select value={targetArea} onValueChange={setTargetArea}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Área que deseja atuar" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Nível de Experiência</Label>
                  <Select value={experienceLevel} onValueChange={(v) => setExperienceLevel(v as "junior" | "pleno" | "senior")}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Júnior (0-2 anos)</SelectItem>
                      <SelectItem value="pleno">Pleno (2-5 anos)</SelectItem>
                      <SelectItem value="senior">Sênior (5+ anos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Modo Transição de Carreira</p>
                      <p className="text-sm text-muted-foreground">
                        Ative se está mudando de área
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={careerTransition}
                    onCheckedChange={setCareerTransition}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferências Salariais */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Expectativa Salarial
                </CardTitle>
                <CardDescription>
                  Configure sua pretensão salarial mínima
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salário Mínimo (R$)</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={salaryMinimum || ""}
                    onChange={(e) => setSalaryMinimum(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Ex: 5000"
                    className="bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Deixe em branco se não tiver preferência
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Modalidade de Trabalho */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Modalidade de Trabalho
                </CardTitle>
                <CardDescription>
                  Selecione suas preferências de trabalho
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm font-medium mb-3">Local de Trabalho</p>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={workPreferences.remote}
                        onCheckedChange={(checked) => 
                          setWorkPreferences(prev => ({ ...prev, remote: checked === true }))
                        }
                      />
                      <span className="text-sm">Remoto</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={workPreferences.hybrid}
                        onCheckedChange={(checked) => 
                          setWorkPreferences(prev => ({ ...prev, hybrid: checked === true }))
                        }
                      />
                      <span className="text-sm">Híbrido</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={workPreferences.onsite}
                        onCheckedChange={(checked) => 
                          setWorkPreferences(prev => ({ ...prev, onsite: checked === true }))
                        }
                      />
                      <span className="text-sm">Presencial</span>
                    </label>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Regime de Contratação</p>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={workPreferences.clt}
                        onCheckedChange={(checked) => 
                          setWorkPreferences(prev => ({ ...prev, clt: checked === true }))
                        }
                      />
                      <span className="text-sm">CLT</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={workPreferences.pj}
                        onCheckedChange={(checked) => 
                          setWorkPreferences(prev => ({ ...prev, pj: checked === true }))
                        }
                      />
                      <span className="text-sm">PJ</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disponibilidade */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Disponibilidade para Estudos
                </CardTitle>
                <CardDescription>
                  Quanto tempo você pode dedicar ao plano de ação diariamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Horas por dia</span>
                    <span className="text-2xl font-bold text-primary">{dailyAvailability}h</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={dailyAvailability}
                    onChange={(e) => setDailyAvailability(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1h</span>
                    <span>4h</span>
                    <span>8h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button 
                variant="hero" 
                size="lg"
                onClick={handleSave}
                disabled={saving}
                className="shadow-glow"
              >
                {saving ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
