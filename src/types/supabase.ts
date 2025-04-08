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
      users: {
        Row: {
          id: string
          email: string
          name: string
          level: number
          experience: number
          completed_missions: number
          streak: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          level?: number
          experience?: number
          completed_missions?: number
          streak?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          level?: number
          experience?: number
          completed_missions?: number
          streak?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_stats: {
        Row: {
          user_id: string
          total_exercises: number
          total_reps: number
          total_distance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          total_exercises?: number
          total_reps?: number
          total_distance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          total_exercises?: number
          total_reps?: number
          total_distance?: number
          created_at?: string
          updated_at?: string
        }
      }
      exercise_history: {
        Row: {
          id: string
          user_id: string
          exercise: string
          reps: number | null
          duration: number | null
          distance: number | null
          performed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise: string
          reps?: number | null
          duration?: number | null
          distance?: number | null
          performed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exercise?: string
          reps?: number | null
          duration?: number | null
          distance?: number | null
          performed_at?: string
        }
      }
      personal_bests: {
        Row: {
          id: string
          user_id: string
          exercise_type: string
          value: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise_type: string
          value: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exercise_type?: string
          value?: number
          created_at?: string
        }
      }
      favorite_exercises: {
        Row: {
          id: string
          user_id: string
          exercise_type: string
          personal_best: number
          times_performed: number
          last_performed: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          exercise_type: string
          personal_best?: number
          times_performed?: number
          last_performed?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          exercise_type?: string
          personal_best?: number
          times_performed?: number
          last_performed?: string | null
          created_at?: string
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