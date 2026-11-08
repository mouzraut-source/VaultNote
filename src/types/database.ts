// Database types - generated from Supabase
// Run: supabase gen types typescript --project-id <id> > src/types/database.ts

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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string
          role: 'student' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email: string
          role?: 'student' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string
          role?: 'student' | 'admin'
          created_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          title: string
          description: string | null
          subject: string | null
          price: number
          storage_path: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          subject?: string | null
          price: number
          storage_path?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          subject?: string | null
          price?: number
          storage_path?: string | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      payment_submissions: {
        Row: {
          id: string
          user_id: string
          product_id: string
          amount: number
          transaction_reference: string
          screenshot_path: string | null
          status: 'pending' | 'approved' | 'rejected'
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          amount: number
          transaction_reference: string
          screenshot_path?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          amount?: number
          transaction_reference?: string
          screenshot_path?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_submissions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          product_id: string
          payment_submission_id: string
          purchased_at: string
          status: 'active' | 'revoked'
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          payment_submission_id: string
          purchased_at?: string
          status?: 'active' | 'revoked'
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          payment_submission_id?: string
          purchased_at?: string
          status?: 'active' | 'revoked'
        }
        Relationships: [
          {
            foreignKeyName: "purchases_payment_submission_id_fkey"
            columns: ["payment_submission_id"]
            isOneToOne: false
            referencedRelation: "payment_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'student' | 'admin'
      payment_status: 'pending' | 'approved' | 'rejected'
      purchase_status: 'active' | 'revoked'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type PaymentSubmission = Database['public']['Tables']['payment_submissions']['Row']
export type Purchase = Database['public']['Tables']['purchases']['Row']