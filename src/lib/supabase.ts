import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          name: string
          description: string
          address: string
          square_footage: number
          price: string
          owner: string
          token_id: string | null
          contract_address: string | null
          image_url: string | null
          is_listed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          address: string
          square_footage: number
          price: string
          owner: string
          token_id?: string | null
          contract_address?: string | null
          image_url?: string | null
          is_listed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          address?: string
          square_footage?: number
          price?: string
          owner?: string
          token_id?: string | null
          contract_address?: string | null
          image_url?: string | null
          is_listed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          property_id: string
          seller: string
          price: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          seller: string
          price: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          seller?: string
          price?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          hash: string
          from_address: string
          to_address: string
          value: string
          gas_used: string
          status: 'pending' | 'success' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          hash: string
          from_address: string
          to_address: string
          value: string
          gas_used: string
          status?: 'pending' | 'success' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          hash?: string
          from_address?: string
          to_address?: string
          value?: string
          gas_used?: string
          status?: 'pending' | 'success' | 'failed'
          created_at?: string
        }
      }
    }
  }
}
