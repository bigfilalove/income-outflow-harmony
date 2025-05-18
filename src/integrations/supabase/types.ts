export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          description: string | null
          id: string
          resource_id: string | null
          resource_type: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          id?: string
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          id?: string
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      budgets: {
        Row: {
          amount: number
          category: string
          company: string | null
          created_at: string
          created_by: string | null
          id: string
          month: number
          period: string
          type: string
          year: number
        }
        Insert: {
          amount: number
          category: string
          company?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          month: number
          period: string
          type: string
          year: number
        }
        Update: {
          amount?: number
          category?: string
          company?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          month?: number
          period?: string
          type?: string
          year?: number
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      file_containers: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          product_type_id: string
          required: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          product_type_id: string
          required?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          product_type_id?: string
          required?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "file_containers_product_type_id_fkey"
            columns: ["product_type_id"]
            isOneToOne: false
            referencedRelation: "product_types"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string | null
          date: string
          description: string
          id: string
          investment_id: string
          project: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          created_by?: string | null
          date?: string
          description: string
          id?: string
          investment_id: string
          project?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string
          id?: string
          investment_id?: string
          project?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_expenses_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      product_instances: {
        Row: {
          created_at: string
          created_by: string
          files: Json
          id: string
          name: string
          parameter_values: Json
          type_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          files?: Json
          id?: string
          name: string
          parameter_values?: Json
          type_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          files?: Json
          id?: string
          name?: string
          parameter_values?: Json
          type_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_instances_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "product_types"
            referencedColumns: ["id"]
          },
        ]
      }
      product_parameters: {
        Row: {
          created_at: string
          default_value: Json | null
          description: string | null
          id: string
          name: string
          options: Json | null
          product_type_id: string
          required: boolean
          type: string
        }
        Insert: {
          created_at?: string
          default_value?: Json | null
          description?: string | null
          id?: string
          name: string
          options?: Json | null
          product_type_id: string
          required?: boolean
          type: string
        }
        Update: {
          created_at?: string
          default_value?: Json | null
          description?: string | null
          id?: string
          name?: string
          options?: Json | null
          product_type_id?: string
          required?: boolean
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_parameters_product_type_id_fkey"
            columns: ["product_type_id"]
            isOneToOne: false
            referencedRelation: "product_types"
            referencedColumns: ["id"]
          },
        ]
      }
      product_types: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          company: string | null
          created_at: string
          created_by: string | null
          date: string
          description: string
          from_company: string | null
          has_allocations: boolean | null
          id: string
          investment_expense_id: string | null
          investor: string | null
          is_investment: boolean | null
          is_reimbursement: boolean | null
          is_transfer: boolean | null
          project: string | null
          reimbursed_to: string | null
          reimbursement_status: string | null
          to_company: string | null
          type: string
        }
        Insert: {
          amount: number
          category: string
          company?: string | null
          created_at?: string
          created_by?: string | null
          date: string
          description: string
          from_company?: string | null
          has_allocations?: boolean | null
          id?: string
          investment_expense_id?: string | null
          investor?: string | null
          is_investment?: boolean | null
          is_reimbursement?: boolean | null
          is_transfer?: boolean | null
          project?: string | null
          reimbursed_to?: string | null
          reimbursement_status?: string | null
          to_company?: string | null
          type: string
        }
        Update: {
          amount?: number
          category?: string
          company?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string
          from_company?: string | null
          has_allocations?: boolean | null
          id?: string
          investment_expense_id?: string | null
          investor?: string | null
          is_investment?: boolean | null
          is_reimbursement?: boolean | null
          is_transfer?: boolean | null
          project?: string | null
          reimbursed_to?: string | null
          reimbursement_status?: string | null
          to_company?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_investment_expense_id_fkey"
            columns: ["investment_expense_id"]
            isOneToOne: false
            referencedRelation: "investment_expenses"
            referencedColumns: ["id"]
          },
        ]
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
          role?: Database["public"]["Enums"]["app_role"]
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
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          password: string
          role: string | null
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          password: string
          role?: string | null
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          password?: string
          role?: string | null
          username?: string
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
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      log_activity: {
        Args: {
          _user_id: string
          _action: string
          _description?: string
          _resource_type?: string
          _resource_id?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "user" | "specialist"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "specialist"],
    },
  },
} as const
