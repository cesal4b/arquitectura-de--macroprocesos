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
      macroproceso_info: {
        Row: {
          macro_nombre: string | null
          macro_slug: string
          objetivo: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          macro_nombre?: string | null
          macro_slug: string
          objetivo?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          macro_nombre?: string | null
          macro_slug?: string
          objetivo?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      module_completions: {
        Row: {
          completed_at: string
          id: string
          module_slug: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          module_slug: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          module_slug?: string
          user_id?: string
        }
        Relationships: []
      }
      procedimientos: {
        Row: {
          created_at: string
          descripcion: string | null
          entregado_responsable: boolean
          estado: Database["public"]["Enums"]["avance_estado"]
          fecha_objetivo: string | null
          id: string
          macro_nombre: string
          macro_slug: string
          nombre: string
          notas: string | null
          porcentaje: number
          proceso_nombre: string
          proceso_slug: string
          responsable: string | null
          updated_at: string
          updated_by: string | null
          url_diagrama: string | null
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          entregado_responsable?: boolean
          estado?: Database["public"]["Enums"]["avance_estado"]
          fecha_objetivo?: string | null
          id?: string
          macro_nombre: string
          macro_slug: string
          nombre: string
          notas?: string | null
          porcentaje?: number
          proceso_nombre: string
          proceso_slug: string
          responsable?: string | null
          updated_at?: string
          updated_by?: string | null
          url_diagrama?: string | null
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          entregado_responsable?: boolean
          estado?: Database["public"]["Enums"]["avance_estado"]
          fecha_objetivo?: string | null
          id?: string
          macro_nombre?: string
          macro_slug?: string
          nombre?: string
          notas?: string | null
          porcentaje?: number
          proceso_nombre?: string
          proceso_slug?: string
          responsable?: string | null
          updated_at?: string
          updated_by?: string | null
          url_diagrama?: string | null
        }
        Relationships: []
      }
      procedimientos_catalogo_ocultos: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          macro_slug: string
          nombre: string
          proceso_slug: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          macro_slug: string
          nombre: string
          proceso_slug: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          macro_slug?: string
          nombre?: string
          proceso_slug?: string
        }
        Relationships: []
      }
      proceso_avance: {
        Row: {
          descripcion: string | null
          estado: Database["public"]["Enums"]["avance_estado"]
          fecha_objetivo: string | null
          id: string
          lideres: string | null
          macro_nombre: string
          macro_slug: string
          notas: string | null
          porcentaje: number
          proceso_nombre: string
          proceso_slug: string
          proposito: string | null
          responsable: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          descripcion?: string | null
          estado?: Database["public"]["Enums"]["avance_estado"]
          fecha_objetivo?: string | null
          id?: string
          lideres?: string | null
          macro_nombre: string
          macro_slug: string
          notas?: string | null
          porcentaje?: number
          proceso_nombre: string
          proceso_slug: string
          proposito?: string | null
          responsable?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          descripcion?: string | null
          estado?: Database["public"]["Enums"]["avance_estado"]
          fecha_objetivo?: string | null
          id?: string
          lideres?: string | null
          macro_nombre?: string
          macro_slug?: string
          notas?: string | null
          porcentaje?: number
          proceso_nombre?: string
          proceso_slug?: string
          proposito?: string | null
          responsable?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      procesos_extra: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          macro_slug: string
          nombre: string
          slug: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          macro_slug: string
          nombre: string
          slug: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          macro_slug?: string
          nombre?: string
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          training_access: boolean
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          training_access?: boolean
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          training_access?: boolean
        }
        Relationships: []
      }
      training_allowlist: {
        Row: {
          added_by: string | null
          created_at: string
          email: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          email: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      training_visits: {
        Row: {
          entered_at: string
          id: string
          page: string
          section: string | null
          user_id: string
        }
        Insert: {
          entered_at?: string
          id?: string
          page: string
          section?: string | null
          user_id: string
        }
        Update: {
          entered_at?: string
          id?: string
          page?: string
          section?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
    }
    Enums: {
      app_role: "admin" | "user"
      avance_estado: "pendiente" | "en_curso" | "aprobado"
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
      app_role: ["admin", "user"],
      avance_estado: ["pendiente", "en_curso", "aprobado"],
    },
  },
} as const
