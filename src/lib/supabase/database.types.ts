/**
 * Generated from the live schema. Regenerate after any migration with:
 *   npx supabase gen types typescript --project-id fprfnbfoqjuwgckhtnxz
 * Do not edit by hand.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.15'
  }
  public: {
    Tables: {
      sessions: {
        Row: {
          author_id: string
          chart: string
          course_id: string
          created_at: string
          files: Json
          group_id: string
          id: string
          image_path: string | null
          math: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          chart?: string
          course_id: string
          created_at?: string
          files?: Json
          group_id: string
          id?: string
          image_path?: string | null
          math?: string
          summary?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          chart?: string
          course_id?: string
          created_at?: string
          files?: Json
          group_id?: string
          id?: string
          image_path?: string | null
          math?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}

export type SessionRow = Database['public']['Tables']['sessions']['Row']
export type SessionInsert = Database['public']['Tables']['sessions']['Insert']
export type SessionUpdate = Database['public']['Tables']['sessions']['Update']
