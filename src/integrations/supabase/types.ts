export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      action_plans: {
        Row: {
          analysis_id: string | null
          created_at: string | null
          id: string
          items: Json | null
          period: Database["public"]["Enums"]["plan_period"]
          progress: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          analysis_id?: string | null
          created_at?: string | null
          id?: string
          items?: Json | null
          period: Database["public"]["Enums"]["plan_period"]
          progress?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          analysis_id?: string | null
          created_at?: string | null
          id?: string
          items?: Json | null
          period?: Database["public"]["Enums"]["plan_period"]
          progress?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_plans_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      analyses: {
        Row: {
          ats_resume_base: string | null
          ats_resume_targeted: string | null
          career_transition_mode: boolean | null
          created_at: string | null
          current_range: string | null
          id: string
          improvement_actions: Json | null
          job_id: string | null
          keywords_used: string[] | null
          optimized_range: string | null
          potential_score: number | null
          resume_id: string | null
          score: number | null
          score_breakdown: Json | null
          user_id: string
        }
        Insert: {
          ats_resume_base?: string | null
          ats_resume_targeted?: string | null
          career_transition_mode?: boolean | null
          created_at?: string | null
          current_range?: string | null
          id?: string
          improvement_actions?: Json | null
          job_id?: string | null
          keywords_used?: string[] | null
          optimized_range?: string | null
          potential_score?: number | null
          resume_id?: string | null
          score?: number | null
          score_breakdown?: Json | null
          user_id: string
        }
        Update: {
          ats_resume_base?: string | null
          ats_resume_targeted?: string | null
          career_transition_mode?: boolean | null
          created_at?: string | null
          current_range?: string | null
          id?: string
          improvement_actions?: Json | null
          job_id?: string | null
          keywords_used?: string[] | null
          optimized_range?: string | null
          potential_score?: number | null
          resume_id?: string | null
          score?: number | null
          score_breakdown?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analyses_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analyses_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_simulations: {
        Row: {
          completed: boolean | null
          created_at: string | null
          feedback: Json | null
          id: string
          job_id: string | null
          questions: Json | null
          user_answers: Json | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          feedback?: Json | null
          id?: string
          job_id?: string | null
          questions?: Json | null
          user_answers?: Json | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          feedback?: Json | null
          id?: string
          job_id?: string | null
          questions?: Json | null
          user_answers?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_simulations_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          analysis_summary: string | null
          area: string | null
          ats_keywords: string[] | null
          company: string | null
          created_at: string | null
          description: string | null
          fairness_level: Database["public"]["Enums"]["fairness_level"] | null
          id: string
          mandatory_skills: string[] | null
          optional_skills: string[] | null
          risk_flags: string[] | null
          seniority: Database["public"]["Enums"]["experience_level"] | null
          title: string
          user_id: string
        }
        Insert: {
          analysis_summary?: string | null
          area?: string | null
          ats_keywords?: string[] | null
          company?: string | null
          created_at?: string | null
          description?: string | null
          fairness_level?: Database["public"]["Enums"]["fairness_level"] | null
          id?: string
          mandatory_skills?: string[] | null
          optional_skills?: string[] | null
          risk_flags?: string[] | null
          seniority?: Database["public"]["Enums"]["experience_level"] | null
          title: string
          user_id: string
        }
        Update: {
          analysis_summary?: string | null
          area?: string | null
          ats_keywords?: string[] | null
          company?: string | null
          created_at?: string | null
          description?: string | null
          fairness_level?: Database["public"]["Enums"]["fairness_level"] | null
          id?: string
          mandatory_skills?: string[] | null
          optional_skills?: string[] | null
          risk_flags?: string[] | null
          seniority?: Database["public"]["Enums"]["experience_level"] | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          career_transition: boolean | null
          created_at: string | null
          current_area: string | null
          daily_availability_hours: number | null
          email: string | null
          experience_level:
            | Database["public"]["Enums"]["experience_level"]
            | null
          id: string
          monthly_analyses_used: number | null
          monthly_uploads_used: number | null
          name: string | null
          plan: Database["public"]["Enums"]["plan_type"] | null
          salary_minimum: number | null
          target_area: string | null
          updated_at: string | null
          work_preferences: Json | null
        }
        Insert: {
          career_transition?: boolean | null
          created_at?: string | null
          current_area?: string | null
          daily_availability_hours?: number | null
          email?: string | null
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          id: string
          monthly_analyses_used?: number | null
          monthly_uploads_used?: number | null
          name?: string | null
          plan?: Database["public"]["Enums"]["plan_type"] | null
          salary_minimum?: number | null
          target_area?: string | null
          updated_at?: string | null
          work_preferences?: Json | null
        }
        Update: {
          career_transition?: boolean | null
          created_at?: string | null
          current_area?: string | null
          daily_availability_hours?: number | null
          email?: string | null
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          id?: string
          monthly_analyses_used?: number | null
          monthly_uploads_used?: number | null
          name?: string | null
          plan?: Database["public"]["Enums"]["plan_type"] | null
          salary_minimum?: number | null
          target_area?: string | null
          updated_at?: string | null
          work_preferences?: Json | null
        }
        Relationships: []
      }
      resumes: {
        Row: {
          courses: Json | null
          created_at: string | null
          education: Json | null
          experiences: Json | null
          file_path: string | null
          id: string
          is_scanned: boolean | null
          languages: Json | null
          ocr_processed: boolean | null
          projects: Json | null
          raw_text: string | null
          soft_skills: string[] | null
          structured_data: Json | null
          summary: string | null
          technical_skills: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          courses?: Json | null
          created_at?: string | null
          education?: Json | null
          experiences?: Json | null
          file_path?: string | null
          id?: string
          is_scanned?: boolean | null
          languages?: Json | null
          ocr_processed?: boolean | null
          projects?: Json | null
          raw_text?: string | null
          soft_skills?: string[] | null
          structured_data?: Json | null
          summary?: string | null
          technical_skills?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          courses?: Json | null
          created_at?: string | null
          education?: Json | null
          experiences?: Json | null
          file_path?: string | null
          id?: string
          is_scanned?: boolean | null
          languages?: Json | null
          ocr_processed?: boolean | null
          projects?: Json | null
          raw_text?: string | null
          soft_skills?: string[] | null
          structured_data?: Json | null
          summary?: string | null
          technical_skills?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      experience_level: "junior" | "pleno" | "senior"
      fairness_level: "green" | "yellow" | "red"
      plan_period: "14" | "30" | "90"
      plan_type: "free" | "pro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      experience_level: ["junior", "pleno", "senior"],
      fairness_level: ["green", "yellow", "red"],
      plan_period: ["14", "30", "90"],
      plan_type: ["free", "pro"],
    },
  },
} as const
