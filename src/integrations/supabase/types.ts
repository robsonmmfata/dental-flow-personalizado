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
      appointments: {
        Row: {
          createdat: string
          date: string
          dentist: string | null
          doctorId: number | null
          doctorName: string[]
          id: number
          notes: string | null
          patientId: number | null
          patientName: string
          service: string
          status: string | null
          time: string
        }
        Insert: {
          createdat?: string
          date: string
          dentist?: string | null
          doctorId?: number | null
          doctorName: string[]
          id?: number
          notes?: string | null
          patientId?: number | null
          patientName: string
          service: string
          status?: string | null
          time: string
        }
        Update: {
          createdat?: string
          date?: string
          dentist?: string | null
          doctorId?: number | null
          doctorName?: string[]
          id?: number
          notes?: string | null
          patientId?: number | null
          patientName?: string
          service?: string
          status?: string | null
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctorid_fkey"
            columns: ["doctorId"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patientid_fkey"
            columns: ["patientId"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          createdat: string
          duedate: string
          id: number
          patientname: string
          paymentmethod: string | null
          procedures: string[]
          status: string | null
          totalvalue: number
        }
        Insert: {
          createdat: string
          duedate: string
          id?: number
          patientname: string
          paymentmethod?: string | null
          procedures: string[]
          status?: string | null
          totalvalue: number
        }
        Update: {
          createdat?: string
          duedate?: string
          id?: number
          patientname?: string
          paymentmethod?: string | null
          procedures?: string[]
          status?: string | null
          totalvalue?: number
        }
        Relationships: []
      }
      custom_users: {
        Row: {
          created_at: string | null
          email: string
          id: number
          name: string | null
          password: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          name?: string | null
          password: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          name?: string | null
          password?: string
          role?: string | null
        }
        Relationships: []
      }
      doctors: {
        Row: {
          createdat: string
          cro: string | null
          email: string | null
          id: number
          name: string
          phone: string | null
          specialty: string | null
          status: string | null
        }
        Insert: {
          createdat?: string
          cro?: string | null
          email?: string | null
          id?: number
          name: string
          phone?: string | null
          specialty?: string | null
          status?: string | null
        }
        Update: {
          createdat?: string
          cro?: string | null
          email?: string | null
          id?: number
          name?: string
          phone?: string | null
          specialty?: string | null
          status?: string | null
        }
        Relationships: []
      }
      exams: {
        Row: {
          created_at: string | null
          exam_date: string
          exam_type: string
          files: string[]
          id: number
          observations: string | null
          patient_name: string
          status: string
        }
        Insert: {
          created_at?: string | null
          exam_date?: string
          exam_type: string
          files?: string[]
          id?: number
          observations?: string | null
          patient_name: string
          status: string
        }
        Update: {
          created_at?: string | null
          exam_date?: string
          exam_type?: string
          files?: string[]
          id?: number
          observations?: string | null
          patient_name?: string
          status?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          address: string | null
          allergies: string | null
          birthdate: string | null
          city: string | null
          cpf: string | null
          createdat: string
          email: string
          emergencycontact: string | null
          emergencyphone: string | null
          id: number
          lastvisit: string | null
          medications: string | null
          name: string
          nextappointment: string | null
          notes: string | null
          phone: string | null
          preferreddoctor: string | null
          status: string | null
        }
        Insert: {
          address?: string | null
          allergies?: string | null
          birthdate?: string | null
          city?: string | null
          cpf?: string | null
          createdat?: string
          email: string
          emergencycontact?: string | null
          emergencyphone?: string | null
          id?: number
          lastvisit?: string | null
          medications?: string | null
          name: string
          nextappointment?: string | null
          notes?: string | null
          phone?: string | null
          preferreddoctor?: string | null
          status?: string | null
        }
        Update: {
          address?: string | null
          allergies?: string | null
          birthdate?: string | null
          city?: string | null
          cpf?: string | null
          createdat?: string
          email?: string
          emergencycontact?: string | null
          emergencyphone?: string | null
          id?: number
          lastvisit?: string | null
          medications?: string | null
          name?: string
          nextappointment?: string | null
          notes?: string | null
          phone?: string | null
          preferreddoctor?: string | null
          status?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          appointmentmtr: number
          category: string | null
          createdat: string
          date: string
          description: string
          id: number
          patientId: number | null
          status: string
          type: string
          value: number
        }
        Insert: {
          appointmentmtr: number
          category?: string | null
          createdat?: string
          date: string
          description: string
          id?: number
          patientId?: number | null
          status: string
          type: string
          value: number
        }
        Update: {
          appointmentmtr?: number
          category?: string | null
          createdat?: string
          date?: string
          description?: string
          id?: number
          patientId?: number | null
          status?: string
          type?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "transactions_patientid_fkey"
            columns: ["patientId"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          password_hash: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          password_hash: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          password_hash?: string
          role?: string | null
          updated_at?: string | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
