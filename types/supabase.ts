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
      api_keys: {
        Row: {
          id: string
          name: string
          key: string
          user_id: string
          created_at: string
          last_used: string | null
          revoked: boolean
        }
        Insert: {
          id?: string
          name: string
          key: string
          user_id: string
          created_at?: string
          last_used?: string | null
          revoked?: boolean
        }
        Update: {
          id?: string
          name?: string
          key?: string
          user_id?: string
          created_at?: string
          last_used?: string | null
          revoked?: boolean
        }
      }
    }
  }
} 