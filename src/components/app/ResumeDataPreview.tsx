import { useState } from "react";
import { 
  User, Mail, Briefcase, GraduationCap, Award, Code, 
  Heart, Globe, ChevronDown, ChevronUp, Building2, Calendar,
  Sparkles, CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Experience {
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  activities: string[];
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string | null;
}

interface Course {
  name: string;
  institution: string;
  year: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

interface Language {
  language: string;
  level: string;
}

interface ResumeStructuredData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  current_role?: string;
  summary?: string;
  experiences?: Experience[];
  education?: Education[];
  courses?: Course[];
  projects?: Project[];
  technical_skills?: string[];
  soft_skills?: string[];
  languages?: Language[];
  is_likely_ocr?: boolean;
  extraction_confidence?: string;
}

interface ResumeDataPreviewProps {
  data: ResumeStructuredData;
}

function SectionHeader({ 
  icon: Icon, 
  title, 
  count,
  isOpen,
  onToggle 
}: { 
  icon: React.ElementType; 
  title: string; 
  count?: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button 
      onClick={onToggle}
      className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-medium">{title}</span>
        {count !== undefined && count > 0 && (
          <Badge variant="secondary" className="text-xs">{count}</Badge>
        )}
      </div>
      {isOpen ? (
        <ChevronUp className="w-4 h-4 text-muted-foreground" />
      ) : (
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );
}

export function ResumeDataPreview({ data }: ResumeDataPreviewProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    contact: true,
    experiences: true,
    education: false,
    skills: true,
    languages: false,
    courses: false,
    projects: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const hasExperiences = data.experiences && data.experiences.length > 0;
  const hasEducation = data.education && data.education.length > 0;
  const hasCourses = data.courses && data.courses.length > 0;
  const hasProjects = data.projects && data.projects.length > 0;
  const hasTechnicalSkills = data.technical_skills && data.technical_skills.length > 0;
  const hasSoftSkills = data.soft_skills && data.soft_skills.length > 0;
  const hasLanguages = data.languages && data.languages.length > 0;

  return (
    <div className="space-y-4">
      {/* Header com confiança da extração */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Dados Extraídos com IA</h3>
            <p className="text-sm text-muted-foreground">
              {data.is_likely_ocr ? "PDF escaneado (OCR aplicado)" : "PDF textual"}
            </p>
          </div>
        </div>
        {data.extraction_confidence && (
          <Badge 
            variant={data.extraction_confidence === "high" ? "default" : "secondary"}
            className={data.extraction_confidence === "high" ? "bg-success text-success-foreground" : ""}
          >
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {data.extraction_confidence === "high" ? "Alta" : 
             data.extraction_confidence === "medium" ? "Média" : "Baixa"} confiança
          </Badge>
        )}
      </div>

      {/* Dados de Contato */}
      <Collapsible open={openSections.contact} onOpenChange={() => toggleSection("contact")}>
        <CollapsibleTrigger asChild>
          <div>
            <SectionHeader 
              icon={User} 
              title="Dados Pessoais" 
              isOpen={openSections.contact}
              onToggle={() => toggleSection("contact")}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
            {data.name && (
              <div className="p-3 rounded-xl bg-muted/20 border border-border/30">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <User className="w-3 h-3" /> Nome
                </p>
                <p className="font-medium">{data.name}</p>
              </div>
            )}
            {data.email && (
              <div className="p-3 rounded-xl bg-muted/20 border border-border/30">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </p>
                <p className="font-medium text-sm break-all">{data.email}</p>
              </div>
            )}
            {data.current_role && (
              <div className="p-3 rounded-xl bg-muted/20 border border-border/30">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> Cargo Atual
                </p>
                <p className="font-medium">{data.current_role}</p>
              </div>
            )}
            {data.location && (
              <div className="p-3 rounded-xl bg-muted/20 border border-border/30">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Localização
                </p>
                <p className="font-medium">{data.location}</p>
              </div>
            )}
          </div>
          {data.summary && (
            <div className="mt-3 p-4 rounded-xl bg-muted/20 border border-border/30 ml-11">
              <p className="text-xs text-muted-foreground mb-2">Resumo Profissional</p>
              <p className="text-sm leading-relaxed">{data.summary}</p>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Experiências */}
      {hasExperiences && (
        <Collapsible open={openSections.experiences} onOpenChange={() => toggleSection("experiences")}>
          <CollapsibleTrigger asChild>
            <div>
              <SectionHeader 
                icon={Briefcase} 
                title="Experiência Profissional" 
                count={data.experiences?.length}
                isOpen={openSections.experiences}
                onToggle={() => toggleSection("experiences")}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-3 pl-11">
            {data.experiences?.map((exp, index) => (
              <div key={index} className="p-4 rounded-xl bg-muted/20 border border-border/30">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-primary">{exp.role}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Building2 className="w-3 h-3" />
                      {exp.company}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                    <Calendar className="w-3 h-3 mr-1" />
                    {exp.start_date} - {exp.end_date || "Atual"}
                  </Badge>
                </div>
                {exp.activities && exp.activities.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {exp.activities.slice(0, 3).map((activity, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {activity}
                      </li>
                    ))}
                    {exp.activities.length > 3 && (
                      <li className="text-xs text-primary">+{exp.activities.length - 3} atividades</li>
                    )}
                  </ul>
                )}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Educação */}
      {hasEducation && (
        <Collapsible open={openSections.education} onOpenChange={() => toggleSection("education")}>
          <CollapsibleTrigger asChild>
            <div>
              <SectionHeader 
                icon={GraduationCap} 
                title="Formação Acadêmica" 
                count={data.education?.length}
                isOpen={openSections.education}
                onToggle={() => toggleSection("education")}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-3 pl-11">
            {data.education?.map((edu, index) => (
              <div key={index} className="p-4 rounded-xl bg-muted/20 border border-border/30">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold">{edu.degree}</h4>
                    <p className="text-sm text-muted-foreground">{edu.field}</p>
                    <p className="text-sm text-primary mt-1">{edu.institution}</p>
                  </div>
                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                    {edu.start_date} - {edu.end_date || "Atual"}
                  </Badge>
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Skills */}
      {(hasTechnicalSkills || hasSoftSkills) && (
        <Collapsible open={openSections.skills} onOpenChange={() => toggleSection("skills")}>
          <CollapsibleTrigger asChild>
            <div>
              <SectionHeader 
                icon={Code} 
                title="Competências" 
                count={(data.technical_skills?.length || 0) + (data.soft_skills?.length || 0)}
                isOpen={openSections.skills}
                onToggle={() => toggleSection("skills")}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-4 pl-11">
            {hasTechnicalSkills && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Code className="w-3 h-3" /> Skills Técnicas
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.technical_skills?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {hasSoftSkills && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Heart className="w-3 h-3" /> Soft Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.soft_skills?.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-primary/30 text-primary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Idiomas */}
      {hasLanguages && (
        <Collapsible open={openSections.languages} onOpenChange={() => toggleSection("languages")}>
          <CollapsibleTrigger asChild>
            <div>
              <SectionHeader 
                icon={Globe} 
                title="Idiomas" 
                count={data.languages?.length}
                isOpen={openSections.languages}
                onToggle={() => toggleSection("languages")}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 pl-11">
            <div className="flex flex-wrap gap-3">
              {data.languages?.map((lang, index) => (
                <div key={index} className="p-3 rounded-xl bg-muted/20 border border-border/30 min-w-[120px]">
                  <p className="font-medium">{lang.language}</p>
                  <p className="text-xs text-muted-foreground">{lang.level}</p>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Cursos */}
      {hasCourses && (
        <Collapsible open={openSections.courses} onOpenChange={() => toggleSection("courses")}>
          <CollapsibleTrigger asChild>
            <div>
              <SectionHeader 
                icon={Award} 
                title="Cursos e Certificações" 
                count={data.courses?.length}
                isOpen={openSections.courses}
                onToggle={() => toggleSection("courses")}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-2 pl-11">
            {data.courses?.map((course, index) => (
              <div key={index} className="p-3 rounded-xl bg-muted/20 border border-border/30 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{course.name}</p>
                  <p className="text-xs text-muted-foreground">{course.institution}</p>
                </div>
                <Badge variant="outline" className="text-xs">{course.year}</Badge>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
