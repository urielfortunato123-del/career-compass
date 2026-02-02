-- ============================================
-- VagaJusta Database Schema
-- ============================================

-- Enums
CREATE TYPE experience_level AS ENUM ('junior', 'pleno', 'senior');
CREATE TYPE fairness_level AS ENUM ('green', 'yellow', 'red');
CREATE TYPE plan_type AS ENUM ('free', 'pro');
CREATE TYPE plan_period AS ENUM ('14', '30', '90');

-- ============================================
-- Profiles (extends auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  current_area TEXT,
  target_area TEXT,
  career_transition BOOLEAN DEFAULT false,
  experience_level experience_level DEFAULT 'junior',
  daily_availability_hours INTEGER DEFAULT 2,
  salary_minimum INTEGER,
  work_preferences JSONB DEFAULT '{"remote": true, "hybrid": false, "onsite": false, "pj": true, "clt": true}'::jsonb,
  plan plan_type DEFAULT 'free',
  monthly_uploads_used INTEGER DEFAULT 0,
  monthly_analyses_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- Resumes
-- ============================================
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path TEXT,
  raw_text TEXT,
  structured_data JSONB,
  summary TEXT,
  experiences JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  courses JSONB DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  languages JSONB DEFAULT '[]'::jsonb,
  technical_skills TEXT[] DEFAULT '{}',
  soft_skills TEXT[] DEFAULT '{}',
  is_scanned BOOLEAN DEFAULT false,
  ocr_processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resumes"
  ON public.resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON public.resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON public.resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON public.resumes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Jobs (analyzed job postings)
-- ============================================
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT,
  area TEXT,
  description TEXT,
  mandatory_skills TEXT[] DEFAULT '{}',
  optional_skills TEXT[] DEFAULT '{}',
  seniority experience_level,
  risk_flags TEXT[] DEFAULT '{}',
  fairness_level fairness_level DEFAULT 'green',
  analysis_summary TEXT,
  ats_keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own jobs"
  ON public.jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own jobs"
  ON public.jobs FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Analyses (resume + job compatibility)
-- ============================================
CREATE TABLE public.analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  score INTEGER DEFAULT 0,
  score_breakdown JSONB DEFAULT '{}'::jsonb,
  potential_score INTEGER,
  current_range TEXT,
  optimized_range TEXT,
  improvement_actions JSONB DEFAULT '[]'::jsonb,
  ats_resume_base TEXT,
  ats_resume_targeted TEXT,
  keywords_used TEXT[] DEFAULT '{}',
  career_transition_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses"
  ON public.analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON public.analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON public.analyses FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Action Plans
-- ============================================
CREATE TABLE public.action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES public.analyses(id) ON DELETE CASCADE,
  period plan_period NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own action plans"
  ON public.action_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own action plans"
  ON public.action_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own action plans"
  ON public.action_plans FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- Interview Simulations
-- ============================================
CREATE TABLE public.interview_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  questions JSONB DEFAULT '[]'::jsonb,
  user_answers JSONB DEFAULT '[]'::jsonb,
  feedback JSONB DEFAULT '[]'::jsonb,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.interview_simulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own simulations"
  ON public.interview_simulations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulations"
  ON public.interview_simulations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own simulations"
  ON public.interview_simulations FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- Trigger for profile creation on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Trigger for updated_at timestamps
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_action_plans_updated_at
  BEFORE UPDATE ON public.action_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- Storage bucket for resumes
-- ============================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false);

CREATE POLICY "Users can upload own resumes"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own resumes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own resumes"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);