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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      collaborations: {
        Row: {
          collaborator_id: string
          created_at: string
          id: string
          idea_id: string | null
          message: string | null
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          collaborator_id: string
          created_at?: string
          id?: string
          idea_id?: string | null
          message?: string | null
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          collaborator_id?: string
          created_at?: string
          id?: string
          idea_id?: string | null
          message?: string | null
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborations_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          idea_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          idea_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          idea_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_comments_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_votes: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_votes_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          created_at: string
          downvotes: number
          founder_id: string
          full_description: string
          funding_goal: number | null
          id: string
          image_url: string | null
          industry: string
          pitch_deck_url: string | null
          short_description: string
          stage: Database["public"]["Enums"]["idea_stage"]
          team_members: string[] | null
          title: string
          updated_at: string
          upvotes: number
          video_url: string | null
          view_count: number
          website_url: string | null
        }
        Insert: {
          created_at?: string
          downvotes?: number
          founder_id: string
          full_description: string
          funding_goal?: number | null
          id?: string
          image_url?: string | null
          industry: string
          pitch_deck_url?: string | null
          short_description: string
          stage?: Database["public"]["Enums"]["idea_stage"]
          team_members?: string[] | null
          title: string
          updated_at?: string
          upvotes?: number
          video_url?: string | null
          view_count?: number
          website_url?: string | null
        }
        Update: {
          created_at?: string
          downvotes?: number
          founder_id?: string
          full_description?: string
          funding_goal?: number | null
          id?: string
          image_url?: string | null
          industry?: string
          pitch_deck_url?: string | null
          short_description?: string
          stage?: Database["public"]["Enums"]["idea_stage"]
          team_members?: string[] | null
          title?: string
          updated_at?: string
          upvotes?: number
          video_url?: string | null
          view_count?: number
          website_url?: string | null
        }
        Relationships: []
      }
      investment_interests: {
        Row: {
          amount: number | null
          created_at: string
          founder_id: string
          id: string
          idea_id: string
          investor_id: string
          message: string | null
          status: Database["public"]["Enums"]["investment_status"]
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          founder_id: string
          id?: string
          idea_id: string
          investor_id: string
          message?: string | null
          status?: Database["public"]["Enums"]["investment_status"]
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          founder_id?: string
          id?: string
          idea_id?: string
          investor_id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["investment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_interests_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          company_name: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          industries_of_interest: string[] | null
          investment_range: string | null
          linkedin_url: string | null
          location: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          industries_of_interest?: string[] | null
          investment_range?: string | null
          linkedin_url?: string | null
          location?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          industries_of_interest?: string[] | null
          investment_range?: string | null
          linkedin_url?: string | null
          location?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
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
      idea_stage: "idea" | "mvp" | "scaling" | "established"
      investment_status: "pending" | "accepted" | "rejected" | "completed"
      user_role: "founder" | "investor" | "reviewer"
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
      idea_stage: ["idea", "mvp", "scaling", "established"],
      investment_status: ["pending", "accepted", "rejected", "completed"],
      user_role: ["founder", "investor", "reviewer"],
    },
  },
} as const
