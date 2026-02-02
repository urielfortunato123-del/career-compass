// TypeScript types matching the database schema

export type ExperienceLevel = 'junior' | 'pleno' | 'senior';
export type FairnessLevel = 'green' | 'yellow' | 'red';
export type PlanType = 'free' | 'pro';
export type PlanPeriod = '14' | '30' | '90';

export interface WorkPreferences {
  remote: boolean;
  hybrid: boolean;
  onsite: boolean;
  pj: boolean;
  clt: boolean;
}

export interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  current_area: string | null;
  target_area: string | null;
  career_transition: boolean;
  experience_level: ExperienceLevel;
  daily_availability_hours: number;
  salary_minimum: number | null;
  work_preferences: WorkPreferences;
  plan: PlanType;
  monthly_uploads_used: number;
  monthly_analyses_used: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  company: string;
  role: string;
  start_date: string; // YYYY-MM
  end_date: string | null; // YYYY-MM or null if current
  activities: string[];
}

export interface Resume {
  id: string;
  user_id: string;
  file_path: string | null;
  raw_text: string | null;
  structured_data: Record<string, unknown> | null;
  summary: string | null;
  experiences: Experience[];
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    start_date: string;
    end_date: string | null;
  }>;
  courses: Array<{
    name: string;
    institution: string;
    year: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  languages: Array<{
    language: string;
    level: string;
  }>;
  technical_skills: string[];
  soft_skills: string[];
  is_scanned: boolean;
  ocr_processed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  user_id: string;
  title: string;
  company: string | null;
  area: string | null;
  description: string | null;
  mandatory_skills: string[];
  optional_skills: string[];
  seniority: ExperienceLevel | null;
  risk_flags: string[];
  fairness_level: FairnessLevel;
  analysis_summary: string | null;
  ats_keywords: string[];
  created_at: string;
}

export interface ScoreBreakdown {
  technical_adherence: number;
  seniority_match: number;
  ats_keywords: number;
  resume_structure: number;
}

export interface ImprovementAction {
  priority: number;
  action: string;
  impact: 'high' | 'medium' | 'low';
  type: 'skill' | 'course' | 'project' | 'experience';
}

export interface Analysis {
  id: string;
  user_id: string;
  resume_id: string | null;
  job_id: string | null;
  score: number;
  score_breakdown: ScoreBreakdown;
  potential_score: number | null;
  current_range: string | null;
  optimized_range: string | null;
  improvement_actions: ImprovementAction[];
  ats_resume_base: string | null;
  ats_resume_targeted: string | null;
  keywords_used: string[];
  career_transition_mode: boolean;
  created_at: string;
}

export interface ActionPlanItem {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'project' | 'application' | 'interview';
  completed: boolean;
  week: number;
}

export interface ActionPlan {
  id: string;
  user_id: string;
  analysis_id: string | null;
  period: PlanPeriod;
  items: ActionPlanItem[];
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type: 'technical' | 'behavioral';
  model_answer: string;
  common_mistakes: string[];
}

export interface InterviewSimulation {
  id: string;
  user_id: string;
  job_id: string | null;
  questions: InterviewQuestion[];
  user_answers: Array<{
    question_id: string;
    answer: string;
  }>;
  feedback: Array<{
    question_id: string;
    score: number;
    feedback: string;
    improvements: string[];
  }>;
  completed: boolean;
  created_at: string;
}

// API Request/Response types
export interface AnalyzeJobRequest {
  description?: string;
  title?: string;
  area?: string;
}

export interface AnalyzeJobResponse {
  job: Job;
  fairness_level: FairnessLevel;
  risk_flags: string[];
  summary: string;
}

export interface GenerateATSResumeRequest {
  resume_id: string;
  job_id?: string;
  career_transition?: boolean;
  target_area?: string;
}

export interface GenerateATSResumeResponse {
  base_resume: string;
  targeted_resume?: string;
  keywords_used: string[];
  changes_made: string[];
}

export interface EmployabilityScoreRequest {
  resume_id: string;
  job_id?: string;
  career_transition?: boolean;
}

export interface EmployabilityScoreResponse {
  score: number;
  potential_score: number;
  breakdown: ScoreBreakdown;
  current_range: string;
  optimized_range: string;
  improvement_actions: ImprovementAction[];
}
