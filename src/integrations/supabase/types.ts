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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
        }
        Relationships: []
      }
      admissions: {
        Row: {
          aadhaar_number: string | null
          achievements: string | null
          allergies: string | null
          blood_group: string | null
          branch: string | null
          category: string | null
          college_id: string | null
          course: string | null
          created_at: string
          current_address: string | null
          date_of_birth: string | null
          declaration_accepted: boolean
          email: string | null
          emergency_contact: string | null
          enrollment_year: string | null
          father_name: string | null
          father_occupation: string | null
          father_phone: string | null
          full_name: string
          gender: string | null
          guardian_name: string | null
          height_cm: number | null
          hobbies: string | null
          hostel_or_dayscholar: string | null
          id: string
          identification_marks: string | null
          medical_conditions: string | null
          mother_name: string | null
          mother_occupation: string | null
          mother_phone: string | null
          nationality: string | null
          ncc_unit: string | null
          ncc_wing: string | null
          permanent_address: string | null
          phone: string | null
          photo_url: string
          prior_ncc_experience: string | null
          religion: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          roll_number: string | null
          status: Database["public"]["Enums"]["admission_status"]
          updated_at: string
          user_id: string
          weight_kg: number | null
          year_of_study: string | null
        }
        Insert: {
          aadhaar_number?: string | null
          achievements?: string | null
          allergies?: string | null
          blood_group?: string | null
          branch?: string | null
          category?: string | null
          college_id?: string | null
          course?: string | null
          created_at?: string
          current_address?: string | null
          date_of_birth?: string | null
          declaration_accepted?: boolean
          email?: string | null
          emergency_contact?: string | null
          enrollment_year?: string | null
          father_name?: string | null
          father_occupation?: string | null
          father_phone?: string | null
          full_name: string
          gender?: string | null
          guardian_name?: string | null
          height_cm?: number | null
          hobbies?: string | null
          hostel_or_dayscholar?: string | null
          id?: string
          identification_marks?: string | null
          medical_conditions?: string | null
          mother_name?: string | null
          mother_occupation?: string | null
          mother_phone?: string | null
          nationality?: string | null
          ncc_unit?: string | null
          ncc_wing?: string | null
          permanent_address?: string | null
          phone?: string | null
          photo_url: string
          prior_ncc_experience?: string | null
          religion?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          roll_number?: string | null
          status?: Database["public"]["Enums"]["admission_status"]
          updated_at?: string
          user_id: string
          weight_kg?: number | null
          year_of_study?: string | null
        }
        Update: {
          aadhaar_number?: string | null
          achievements?: string | null
          allergies?: string | null
          blood_group?: string | null
          branch?: string | null
          category?: string | null
          college_id?: string | null
          course?: string | null
          created_at?: string
          current_address?: string | null
          date_of_birth?: string | null
          declaration_accepted?: boolean
          email?: string | null
          emergency_contact?: string | null
          enrollment_year?: string | null
          father_name?: string | null
          father_occupation?: string | null
          father_phone?: string | null
          full_name?: string
          gender?: string | null
          guardian_name?: string | null
          height_cm?: number | null
          hobbies?: string | null
          hostel_or_dayscholar?: string | null
          id?: string
          identification_marks?: string | null
          medical_conditions?: string | null
          mother_name?: string | null
          mother_occupation?: string | null
          mother_phone?: string | null
          nationality?: string | null
          ncc_unit?: string | null
          ncc_wing?: string | null
          permanent_address?: string | null
          phone?: string | null
          photo_url?: string
          prior_ncc_experience?: string | null
          religion?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          roll_number?: string | null
          status?: Database["public"]["Enums"]["admission_status"]
          updated_at?: string
          user_id?: string
          weight_kg?: number | null
          year_of_study?: string | null
        }
        Relationships: []
      }
      announcements: {
        Row: {
          body: string
          category: Database["public"]["Enums"]["announcement_category"]
          created_at: string
          created_by: string | null
          id: string
          pinned: boolean
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          category?: Database["public"]["Enums"]["announcement_category"]
          created_at?: string
          created_by?: string | null
          id?: string
          pinned?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          category?: Database["public"]["Enums"]["announcement_category"]
          created_at?: string
          created_by?: string | null
          id?: string
          pinned?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          attendance_date: string
          cadet_user_id: string
          created_at: string
          id: string
          marked_by: string | null
          remarks: string | null
          status: Database["public"]["Enums"]["attendance_status"]
        }
        Insert: {
          attendance_date: string
          cadet_user_id: string
          created_at?: string
          id?: string
          marked_by?: string | null
          remarks?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
        }
        Update: {
          attendance_date?: string
          cadet_user_id?: string
          created_at?: string
          id?: string
          marked_by?: string | null
          remarks?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          title: string | null
          uploaded_by: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          title?: string | null
          uploaded_by?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          title?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          cadet_user_id: string
          created_at: string
          from_date: string
          id: string
          leave_type: string
          reason: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["leave_status"]
          to_date: string
          updated_at: string
        }
        Insert: {
          cadet_user_id: string
          created_at?: string
          from_date: string
          id?: string
          leave_type: string
          reason: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["leave_status"]
          to_date: string
          updated_at?: string
        }
        Update: {
          cadet_user_id?: string
          created_at?: string
          from_date?: string
          id?: string
          leave_type?: string
          reason?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["leave_status"]
          to_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      library_items: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          file_url: string
          id: string
          title: string
          uploaded_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_url: string
          id?: string
          title: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_url?: string
          id?: string
          title?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      nominal_roll: {
        Row: {
          cadet_user_id: string | null
          course: string | null
          created_at: string
          created_by: string | null
          full_name: string
          id: string
          notes: string | null
          rank: string | null
          regimental_number: string | null
          year_of_study: string | null
        }
        Insert: {
          cadet_user_id?: string | null
          course?: string | null
          created_at?: string
          created_by?: string | null
          full_name: string
          id?: string
          notes?: string | null
          rank?: string | null
          regimental_number?: string | null
          year_of_study?: string | null
        }
        Update: {
          cadet_user_id?: string | null
          course?: string | null
          created_at?: string
          created_by?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          rank?: string | null
          regimental_number?: string | null
          year_of_study?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approval_reviewed_at: string | null
          approval_reviewed_by: string | null
          approval_status: Database["public"]["Enums"]["account_approval_status"]
          bio: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          photo_url: string | null
          profile_completed: boolean
          rank: string | null
          regimental_number: string | null
          updated_at: string
          welcomed_at: string | null
        }
        Insert: {
          approval_reviewed_at?: string | null
          approval_reviewed_by?: string | null
          approval_status?: Database["public"]["Enums"]["account_approval_status"]
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id: string
          phone?: string | null
          photo_url?: string | null
          profile_completed?: boolean
          rank?: string | null
          regimental_number?: string | null
          updated_at?: string
          welcomed_at?: string | null
        }
        Update: {
          approval_reviewed_at?: string | null
          approval_reviewed_by?: string | null
          approval_status?: Database["public"]["Enums"]["account_approval_status"]
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          photo_url?: string | null
          profile_completed?: boolean
          rank?: string | null
          regimental_number?: string | null
          updated_at?: string
          welcomed_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_senior_or_above: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      account_approval_status: "pending" | "approved" | "rejected"
      admission_status: "pending" | "approved" | "rejected"
      announcement_category: "camp" | "circular" | "notification"
      app_role: "ano" | "main_senior" | "senior" | "cadet"
      attendance_status: "present" | "absent" | "leave"
      leave_status: "pending" | "approved" | "rejected"
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
      account_approval_status: ["pending", "approved", "rejected"],
      admission_status: ["pending", "approved", "rejected"],
      announcement_category: ["camp", "circular", "notification"],
      app_role: ["ano", "main_senior", "senior", "cadet"],
      attendance_status: ["present", "absent", "leave"],
      leave_status: ["pending", "approved", "rejected"],
    },
  },
} as const
