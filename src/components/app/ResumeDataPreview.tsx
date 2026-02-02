import { useState } from "react";
import { 
  User, Mail, Briefcase, GraduationCap, Award, Code, 
  Heart, Globe, ChevronDown, ChevronUp, Building2, Calendar,
  Sparkles, CheckCircle2, Pencil, X, Plus, Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface Language {
  language: string;
  level: string;
}

export interface ResumeStructuredData {
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
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  technical_skills?: string[];
  soft_skills?: string[];
  languages?: Language[];
  is_likely_ocr?: boolean;
  extraction_confidence?: string;
}

interface ResumeDataPreviewProps {
  data: ResumeStructuredData;
  onDataChange?: (data: ResumeStructuredData) => void;
  editable?: boolean;
}

function SectionHeader({ 
  icon: Icon, 
  title, 
  count,
  isOpen,
  onToggle,
  onEdit,
  isEditing 
}: { 
  icon: React.ElementType; 
  title: string; 
  count?: number;
  isOpen: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  isEditing?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={onToggle}
        className="flex-1 flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
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
      {onEdit && (
        <Button
          variant={isEditing ? "default" : "ghost"}
          size="icon"
          onClick={onEdit}
          className="h-10 w-10 shrink-0"
        >
          {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
        </Button>
      )}
    </div>
  );
}

export function ResumeDataPreview({ data, onDataChange, editable = true }: ResumeDataPreviewProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    contact: true,
    experiences: true,
    education: false,
    skills: true,
    languages: false,
    courses: false,
  });

  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({});
  const [localData, setLocalData] = useState<ResumeStructuredData>(data);
  const [newSkill, setNewSkill] = useState("");
  const [newSoftSkill, setNewSoftSkill] = useState("");

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleEditing = (section: string) => {
    if (editingSections[section]) {
      // Save changes
      onDataChange?.(localData);
    }
    setEditingSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateField = (field: keyof ResumeStructuredData, value: unknown) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = (type: "technical" | "soft") => {
    const skill = type === "technical" ? newSkill.trim() : newSoftSkill.trim();
    if (!skill) return;
    
    const field = type === "technical" ? "technical_skills" : "soft_skills";
    const current = localData[field] || [];
    if (!current.includes(skill)) {
      updateField(field, [...current, skill]);
    }
    type === "technical" ? setNewSkill("") : setNewSoftSkill("");
  };

  const removeSkill = (type: "technical" | "soft", index: number) => {
    const field = type === "technical" ? "technical_skills" : "soft_skills";
    const current = localData[field] || [];
    updateField(field, current.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof Experience, value: unknown) => {
    const experiences = [...(localData.experiences || [])];
    experiences[index] = { ...experiences[index], [field]: value };
    updateField("experiences", experiences);
  };

  const updateEducation = (index: number, field: keyof Education, value: unknown) => {
    const education = [...(localData.education || [])];
    education[index] = { ...education[index], [field]: value };
    updateField("education", education);
  };

  const updateLanguage = (index: number, field: keyof Language, value: string) => {
    const languages = [...(localData.languages || [])];
    languages[index] = { ...languages[index], [field]: value };
    updateField("languages", languages);
  };

  const addLanguage = () => {
    const languages = [...(localData.languages || []), { language: "", level: "" }];
    updateField("languages", languages);
  };

  const removeLanguage = (index: number) => {
    const languages = (localData.languages || []).filter((_, i) => i !== index);
    updateField("languages", languages);
  };

  const displayData = localData;
  const hasExperiences = displayData.experiences && displayData.experiences.length > 0;
  const hasEducation = displayData.education && displayData.education.length > 0;
  const hasCourses = displayData.courses && displayData.courses.length > 0;
  const hasTechnicalSkills = displayData.technical_skills && displayData.technical_skills.length > 0;
  const hasSoftSkills = displayData.soft_skills && displayData.soft_skills.length > 0;
  const hasLanguages = displayData.languages && displayData.languages.length > 0;

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
              {displayData.is_likely_ocr ? "PDF escaneado (OCR aplicado)" : "PDF textual"}
              {editable && " • Clique no lápis para editar"}
            </p>
          </div>
        </div>
        {displayData.extraction_confidence && (
          <Badge 
            variant={displayData.extraction_confidence === "high" ? "default" : "secondary"}
            className={displayData.extraction_confidence === "high" ? "bg-success text-success-foreground" : ""}
          >
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {displayData.extraction_confidence === "high" ? "Alta" : 
             displayData.extraction_confidence === "medium" ? "Média" : "Baixa"} confiança
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
              onEdit={editable ? () => toggleEditing("contact") : undefined}
              isEditing={editingSections.contact}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          {editingSections.contact ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Nome</label>
                <Input
                  value={localData.name || ""}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Nome completo"
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Email</label>
                <Input
                  value={localData.email || ""}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="email@exemplo.com"
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Cargo Atual</label>
                <Input
                  value={localData.current_role || ""}
                  onChange={(e) => updateField("current_role", e.target.value)}
                  placeholder="Desenvolvedor Senior"
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Localização</label>
                <Input
                  value={localData.location || ""}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="São Paulo, SP"
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs text-muted-foreground">Resumo Profissional</label>
                <Textarea
                  value={localData.summary || ""}
                  onChange={(e) => updateField("summary", e.target.value)}
                  placeholder="Breve resumo da sua carreira..."
                  className="bg-background/50 min-h-[80px]"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
                {displayData.name && (
                  <div className="p-3 rounded-xl bg-muted/20 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <User className="w-3 h-3" /> Nome
                    </p>
                    <p className="font-medium">{displayData.name}</p>
                  </div>
                )}
                {displayData.email && (
                  <div className="p-3 rounded-xl bg-muted/20 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </p>
                    <p className="font-medium text-sm break-all">{displayData.email}</p>
                  </div>
                )}
                {displayData.current_role && (
                  <div className="p-3 rounded-xl bg-muted/20 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> Cargo Atual
                    </p>
                    <p className="font-medium">{displayData.current_role}</p>
                  </div>
                )}
                {displayData.location && (
                  <div className="p-3 rounded-xl bg-muted/20 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Localização
                    </p>
                    <p className="font-medium">{displayData.location}</p>
                  </div>
                )}
              </div>
              {displayData.summary && (
                <div className="mt-3 p-4 rounded-xl bg-muted/20 border border-border/30 ml-11">
                  <p className="text-xs text-muted-foreground mb-2">Resumo Profissional</p>
                  <p className="text-sm leading-relaxed">{displayData.summary}</p>
                </div>
              )}
            </>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Experiências */}
      {(hasExperiences || editingSections.experiences) && (
        <Collapsible open={openSections.experiences} onOpenChange={() => toggleSection("experiences")}>
          <CollapsibleTrigger asChild>
            <div>
              <SectionHeader 
                icon={Briefcase} 
                title="Experiência Profissional" 
                count={displayData.experiences?.length}
                isOpen={openSections.experiences}
                onToggle={() => toggleSection("experiences")}
                onEdit={editable ? () => toggleEditing("experiences") : undefined}
                isEditing={editingSections.experiences}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-3 pl-11">
            {editingSections.experiences ? (
              displayData.experiences?.map((exp, index) => (
                <div key={index} className="p-4 rounded-xl bg-muted/20 border border-border/30 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Cargo</label>
                      <Input
                        value={exp.role}
                        onChange={(e) => updateExperience(index, "role", e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Empresa</label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(index, "company", e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Data Início</label>
                      <Input
                        value={exp.start_date}
                        onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                        placeholder="2022-01"
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Data Fim</label>
                      <Input
                        value={exp.end_date || ""}
                        onChange={(e) => updateExperience(index, "end_date", e.target.value || null)}
                        placeholder="Atual"
                        className="bg-background/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Atividades (uma por linha)</label>
                    <Textarea
                      value={exp.activities?.join("\n") || ""}
                      onChange={(e) => updateExperience(index, "activities", e.target.value.split("\n").filter(a => a.trim()))}
                      className="bg-background/50 min-h-[60px]"
                      placeholder="Desenvolvimento de features&#10;Liderança de equipe"
                    />
                  </div>
                </div>
              ))
            ) : (
              displayData.experiences?.map((exp, index) => (
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
              ))
            )}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Educação */}
      {(hasEducation || editingSections.education) && (
        <Collapsible open={openSections.education} onOpenChange={() => toggleSection("education")}>
          <CollapsibleTrigger asChild>
            <div>
              <SectionHeader 
                icon={GraduationCap} 
                title="Formação Acadêmica" 
                count={displayData.education?.length}
                isOpen={openSections.education}
                onToggle={() => toggleSection("education")}
                onEdit={editable ? () => toggleEditing("education") : undefined}
                isEditing={editingSections.education}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-3 pl-11">
            {editingSections.education ? (
              displayData.education?.map((edu, index) => (
                <div key={index} className="p-4 rounded-xl bg-muted/20 border border-border/30 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Grau</label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                        placeholder="Bacharelado"
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Área</label>
                      <Input
                        value={edu.field}
                        onChange={(e) => updateEducation(index, "field", e.target.value)}
                        placeholder="Ciência da Computação"
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs text-muted-foreground">Instituição</label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, "institution", e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              displayData.education?.map((edu, index) => (
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
              ))
            )}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Skills */}
      {(hasTechnicalSkills || hasSoftSkills || editingSections.skills) && (
        <Collapsible open={openSections.skills} onOpenChange={() => toggleSection("skills")}>
          <CollapsibleTrigger asChild>
            <div>
              <SectionHeader 
                icon={Code} 
                title="Competências" 
                count={(displayData.technical_skills?.length || 0) + (displayData.soft_skills?.length || 0)}
                isOpen={openSections.skills}
                onToggle={() => toggleSection("skills")}
                onEdit={editable ? () => toggleEditing("skills") : undefined}
                isEditing={editingSections.skills}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-4 pl-11">
            {editingSections.skills ? (
              <>
                <div>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Code className="w-3 h-3" /> Skills Técnicas
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {localData.technical_skills?.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs pr-1">
                        {skill}
                        <button 
                          onClick={() => removeSkill("technical", index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Adicionar skill técnica"
                      className="bg-background/50 flex-1"
                      onKeyDown={(e) => e.key === "Enter" && addSkill("technical")}
                    />
                    <Button size="sm" onClick={() => addSkill("technical")}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Heart className="w-3 h-3" /> Soft Skills
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {localData.soft_skills?.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-primary/30 text-primary pr-1">
                        {skill}
                        <button 
                          onClick={() => removeSkill("soft", index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newSoftSkill}
                      onChange={(e) => setNewSoftSkill(e.target.value)}
                      placeholder="Adicionar soft skill"
                      className="bg-background/50 flex-1"
                      onKeyDown={(e) => e.key === "Enter" && addSkill("soft")}
                    />
                    <Button size="sm" onClick={() => addSkill("soft")}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {hasTechnicalSkills && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <Code className="w-3 h-3" /> Skills Técnicas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {displayData.technical_skills?.map((skill, index) => (
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
                      {displayData.soft_skills?.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-primary/30 text-primary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Idiomas */}
      {(hasLanguages || editingSections.languages) && (
        <Collapsible open={openSections.languages} onOpenChange={() => toggleSection("languages")}>
          <CollapsibleTrigger asChild>
            <div>
              <SectionHeader 
                icon={Globe} 
                title="Idiomas" 
                count={displayData.languages?.length}
                isOpen={openSections.languages}
                onToggle={() => toggleSection("languages")}
                onEdit={editable ? () => toggleEditing("languages") : undefined}
                isEditing={editingSections.languages}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 pl-11">
            {editingSections.languages ? (
              <div className="space-y-2">
                {localData.languages?.map((lang, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={lang.language}
                      onChange={(e) => updateLanguage(index, "language", e.target.value)}
                      placeholder="Idioma"
                      className="bg-background/50 flex-1"
                    />
                    <Input
                      value={lang.level}
                      onChange={(e) => updateLanguage(index, "level", e.target.value)}
                      placeholder="Nível"
                      className="bg-background/50 w-32"
                    />
                    <Button size="icon" variant="ghost" onClick={() => removeLanguage(index)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={addLanguage}>
                  <Plus className="w-4 h-4 mr-1" /> Adicionar Idioma
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {displayData.languages?.map((lang, index) => (
                  <div key={index} className="p-3 rounded-xl bg-muted/20 border border-border/30 min-w-[120px]">
                    <p className="font-medium">{lang.language}</p>
                    <p className="text-xs text-muted-foreground">{lang.level}</p>
                  </div>
                ))}
              </div>
            )}
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
                count={displayData.courses?.length}
                isOpen={openSections.courses}
                onToggle={() => toggleSection("courses")}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 space-y-2 pl-11">
            {displayData.courses?.map((course, index) => (
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
