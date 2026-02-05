import { useState } from "react";
import { 
  Search, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Mail, 
  ExternalLink, 
  Loader2,
  TrendingUp,
  Building2,
  Lightbulb,
  CheckCircle,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchJobs } from "@/hooks/useSearchJobs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobSearchProps {
  resumeData?: Record<string, unknown>;
}

export function JobSearch({ resumeData }: JobSearchProps) {
  const [targetRole, setTargetRole] = useState("");
  const [targetArea, setTargetArea] = useState("");
  const [locationPreference, setLocationPreference] = useState("");
  const [country, setCountry] = useState("brasil");
  const [customLocation, setCustomLocation] = useState("");
  const [salaryExpectation, setSalaryExpectation] = useState("");
  const { loading, result, searchJobs } = useSearchJobs();

  const getLocationString = () => {
    if (country === "custom" && customLocation) {
      return customLocation;
    }
    const countryNames: Record<string, string> = {
      brasil: "Brasil",
      mundial: "Qualquer país do mundo",
      eua: "Estados Unidos",
      portugal: "Portugal",
      canada: "Canadá",
      alemanha: "Alemanha",
      argentina: "Argentina",
      paraguai: "Paraguai",
      uruguai: "Uruguai",
      chile: "Chile",
      mexico: "México",
      espanha: "Espanha",
      uk: "Reino Unido",
      irlanda: "Irlanda",
    };
    const countryName = countryNames[country] || country;
    return locationPreference ? `${locationPreference}, ${countryName}` : countryName;
  };

  const handleSearch = async () => {
    await searchJobs({
      resume: resumeData,
      target_role: targetRole,
      target_area: targetArea,
      location_preference: getLocationString(),
      salary_expectation: salaryExpectation,
    });
  };

  if (result) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Market Insights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center">
            <DollarSign className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Salário Médio</p>
            <p className="text-sm font-semibold">{result.market_insights?.average_salary}</p>
          </div>
          <div className="p-4 rounded-2xl bg-success/10 border border-success/20 text-center">
            <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Demanda</p>
            <p className="text-sm font-semibold capitalize">{result.market_insights?.demand_level}</p>
          </div>
          <div className="col-span-2 p-4 rounded-2xl bg-muted/20 border border-border/30">
            <p className="text-xs text-muted-foreground mb-2">Skills em Alta</p>
            <div className="flex flex-wrap gap-1.5">
              {result.market_insights?.trending_skills?.slice(0, 4).map((skill: string, i: number) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Vagas Compatíveis ({result.jobs?.length || 0})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {result.jobs?.map((job: any, i: number) => (
              <div 
                key={i} 
                className="p-5 rounded-2xl bg-muted/20 border border-border/30 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{job.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Building2 className="w-4 h-4" />
                      <span>{job.company}</span>
                      <span className="text-border">•</span>
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                    {job.match_percentage}%
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{job.description}</p>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1.5 text-success">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">{job.salary_range}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground italic">{job.tips}</p>
                  {job.contact && (
                    <a 
                      href={job.contact.startsWith('http') ? job.contact : `mailto:${job.contact}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      {job.contact.includes('@') ? (
                        <>
                          <Mail className="w-4 h-4" />
                          Enviar Currículo
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          Ver Vaga
                        </>
                      )}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Sites */}
        <div className="p-5 rounded-2xl bg-muted/20 border border-border/30">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-primary" />
            Sites Recomendados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.recommended_sites?.map((site: any, i: number) => (
              <a
                key={i}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30 hover:border-primary/30 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{site.name}</p>
                  <p className="text-xs text-muted-foreground">{site.specialty}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>

        {/* Interview Tips */}
        <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-warning" />
            Dicas para Entrevista
          </h3>
          <ul className="space-y-2">
            {result.interview_preparation?.map((tip: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => searchJobs({ resume: resumeData })}
        >
          <Search className="w-4 h-4 mr-2" />
          Buscar Novas Vagas
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
          <Search className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold mb-2">Buscar Vagas Compatíveis</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          A IA vai encontrar oportunidades reais com salário e contato para candidatura
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Cargo desejado *</label>
          <Input
            placeholder="Ex: Desenvolvedor Frontend, Analista de Dados..."
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="bg-muted/20 border-border/50 focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Área de atuação</label>
          <Input
            placeholder="Ex: Tecnologia, Financeiro, Saúde..."
            value={targetArea}
            onChange={(e) => setTargetArea(e.target.value)}
            className="bg-muted/20 border-border/50 focus:border-primary"
          />
        </div>

        {/* Location Section */}
        <div className="p-4 rounded-2xl bg-muted/10 border border-border/30 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Onde você quer trabalhar?</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">País/Região</label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="bg-muted/20 border-border/50">
                  <SelectValue placeholder="Selecione o país" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brasil">🇧🇷 Brasil</SelectItem>
                  <SelectItem value="mundial">🌍 Todo o Mundo</SelectItem>
                  <SelectItem value="eua">🇺🇸 Estados Unidos</SelectItem>
                  <SelectItem value="portugal">🇵🇹 Portugal</SelectItem>
                  <SelectItem value="canada">🇨🇦 Canadá</SelectItem>
                  <SelectItem value="alemanha">🇩🇪 Alemanha</SelectItem>
                  <SelectItem value="uk">🇬🇧 Reino Unido</SelectItem>
                  <SelectItem value="irlanda">🇮🇪 Irlanda</SelectItem>
                  <SelectItem value="espanha">🇪🇸 Espanha</SelectItem>
                  <SelectItem value="argentina">🇦🇷 Argentina</SelectItem>
                  <SelectItem value="paraguai">🇵🇾 Paraguai</SelectItem>
                  <SelectItem value="uruguai">🇺🇾 Uruguai</SelectItem>
                  <SelectItem value="chile">🇨🇱 Chile</SelectItem>
                  <SelectItem value="mexico">🇲🇽 México</SelectItem>
                  <SelectItem value="custom">📍 Outro local...</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {country === "custom" ? (
              <div>
                <label className="text-sm font-medium mb-2 block">Local específico</label>
                <Input
                  placeholder="Ex: Japão, Dubai, Austrália..."
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className="bg-muted/20 border-border/50 focus:border-primary"
                />
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium mb-2 block">Cidade/Estado (opcional)</label>
                <Input
                  placeholder={country === "brasil" ? "Ex: São Paulo, Remoto..." : "Ex: Lisboa, Remoto..."}
                  value={locationPreference}
                  onChange={(e) => setLocationPreference(e.target.value)}
                  className="bg-muted/20 border-border/50 focus:border-primary"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Expectativa Salarial</label>
          <Input
            placeholder={country === "brasil" ? "Ex: R$ 8.000 - R$ 12.000" : "Ex: $5,000 - $8,000 USD"}
            value={salaryExpectation}
            onChange={(e) => setSalaryExpectation(e.target.value)}
            className="bg-muted/20 border-border/50 focus:border-primary"
          />
        </div>
      </div>

      {/* What will be searched */}
      <div className="p-5 rounded-2xl bg-muted/20 border border-border/30">
        <p className="text-sm font-medium mb-4">O que você vai receber:</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            "Vagas compatíveis",
            "Faixas salariais",
            "Contatos para aplicar",
            "Sites recomendados",
            "Insights do mercado",
            "Dicas de entrevista",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="hero"
        size="lg"
        className="w-full shadow-glow"
        onClick={handleSearch}
        disabled={loading || !targetRole}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Buscando vagas...
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            Buscar Vagas Compatíveis
          </>
        )}
      </Button>
    </div>
  );
}
