
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          amount: number
          description: string
          category: string
          date: string
          type: 'income' | 'expense' | 'transfer'
          is_reimbursement: boolean
          reimbursed_to: string | null
          reimbursement_status: 'pending' | 'completed' | null
          created_by: string | null
          created_at: string
          company: string | null
          project: string | null
          is_transfer: boolean
          from_company: string | null
          to_company: string | null
          has_allocations: boolean
        }
        Insert: {
          id?: string
          amount: number
          description: string
          category: string
          date: string
          type: 'income' | 'expense' | 'transfer'
          is_reimbursement?: boolean
          reimbursed_to?: string | null
          reimbursement_status?: 'pending' | 'completed' | null
          created_by?: string | null
          created_at?: string
          company?: string | null
          project?: string | null
          is_transfer?: boolean
          from_company?: string | null
          to_company?: string | null
          has_allocations?: boolean
        }
        Update: {
          id?: string
          amount?: number
          description?: string
          category?: string
          date?: string
          type?: 'income' | 'expense' | 'transfer'
          is_reimbursement?: boolean
          reimbursed_to?: string | null
          reimbursement_status?: 'pending' | 'completed' | null
          created_by?: string | null
          created_at?: string
          company?: string | null
          project?: string | null
          is_transfer?: boolean
          from_company?: string | null
          to_company?: string | null
          has_allocations?: boolean
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          type: 'income' | 'expense' | 'reimbursement' | 'transfer'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'income' | 'expense' | 'reimbursement' | 'transfer'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'income' | 'expense' | 'reimbursement' | 'transfer'
          created_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          username: string
          password: string
          role: 'admin' | 'user' | 'basic'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          username: string
          password: string
          role?: 'admin' | 'user' | 'basic'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          username?: string
          password?: string
          role?: 'admin' | 'user' | 'basic'
          created_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          category: string
          amount: number
          period: string
          year: number
          month: number
          type: 'expense' | 'income'
          created_by: string | null
          created_at: string
          company: string | null
        }
        Insert: {
          id?: string
          category: string
          amount: number
          period: string
          year: number
          month: number
          type: 'expense' | 'income'
          created_by?: string | null
          created_at?: string
          company?: string | null
        }
        Update: {
          id?: string
          category?: string
          amount?: number
          period?: string
          year?: number
          month?: number
          type?: 'expense' | 'income'
          created_by?: string | null
          created_at?: string
          company?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
