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
        PostgrestVersion: "13.0.5"
    }
    public: {
        Tables: {
            activities: {
                Row: {
                    activity_type: string
                    avg_hr: number | null
                    calories: number | null
                    created_at: string | null
                    distance: number | null
                    duration: number | null
                    id: number
                    start_time: string
                    user_id: string
                }
                Insert: {
                    activity_type: string
                    avg_hr?: number | null
                    calories?: number | null
                    created_at?: string | null
                    distance?: number | null
                    duration?: number | null
                    id?: number
                    start_time: string
                    user_id: string
                }
                Update: {
                    activity_type?: string
                    avg_hr?: number | null
                    calories?: number | null
                    created_at?: string | null
                    distance?: number | null
                    duration?: number | null
                    id?: number
                    start_time?: string
                    user_id?: string
                }
                Relationships: []
            }
            assets: {
                Row: {
                    cost_basis: number | null
                    created_at: string | null
                    growth_rate: number | null
                    id: string
                    interest_rate: number | null
                    loan_outstanding: number | null
                    loan_term: number | null
                    name: string
                    rental_income: number | null
                    type: string
                    user_id: string
                    value: number
                }
                Insert: {
                    cost_basis?: number | null
                    created_at?: string | null
                    growth_rate?: number | null
                    id?: string
                    interest_rate?: number | null
                    loan_outstanding?: number | null
                    loan_term?: number | null
                    name: string
                    rental_income?: number | null
                    type: string
                    user_id: string
                    value: number
                }
                Update: {
                    cost_basis?: number | null
                    created_at?: string | null
                    growth_rate?: number | null
                    id?: string
                    interest_rate?: number | null
                    loan_outstanding?: number | null
                    loan_term?: number | null
                    name?: string
                    rental_income?: number | null
                    type?: string
                    user_id?: string
                    value?: number
                }
                Relationships: []
            }
            daily_metrics: {
                Row: {
                    id: string
                    user_id: string
                    date: string
                    sleep_score: number | null
                    hrv: number | null
                    rhr: number | null
                    steps: number | null
                    stress_level: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    date: string
                    sleep_score?: number | null
                    hrv?: number | null
                    rhr?: number | null
                    steps?: number | null
                    stress_level?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    date?: string
                    sleep_score?: number | null
                    hrv?: number | null
                    rhr?: number | null
                    steps?: number | null
                    stress_level?: number | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "daily_metrics_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            budget_items: {
                Row: {
                    amount: number
                    category: string
                    created_at: string | null
                    id: string
                    is_recurring: boolean | null
                    name: string
                    user_id: string
                }
                Insert: {
                    amount: number
                    category: string
                    created_at?: string | null
                    id?: string
                    is_recurring?: boolean | null
                    name: string
                    user_id: string
                }
                Update: {
                    amount?: number
                    category?: string
                    created_at?: string | null
                    id?: string
                    is_recurring?: boolean | null
                    name?: string
                    user_id?: string
                }
                Relationships: []
            }
            daily_logs: {
                Row: {
                    completed: boolean | null
                    created_at: string | null
                    data: Json | null
                    date: string
                    id: string
                    phase_id: string | null
                    protocol_id: string
                    user_id: string
                }
                Insert: {
                    completed?: boolean | null
                    created_at?: string | null
                    data?: Json | null
                    date: string
                    id?: string
                    phase_id?: string | null
                    protocol_id: string
                    user_id: string
                }
                Update: {
                    completed?: boolean | null
                    created_at?: string | null
                    data?: Json | null
                    date?: string
                    id?: string
                    phase_id?: string | null
                    protocol_id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "daily_logs_phase_id_fkey"
                        columns: ["phase_id"]
                        isOneToOne: false
                        referencedRelation: "protocol_phases"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "daily_logs_protocol_id_fkey"
                        columns: ["protocol_id"]
                        isOneToOne: false
                        referencedRelation: "protocols"
                        referencedColumns: ["id"]
                    },
                ]
            }
            expenses: {
                Row: {
                    amount: number
                    category: string
                    created_at: string | null
                    date: string
                    description: string
                    id: string
                    user_id: string
                }
                Insert: {
                    amount: number
                    category: string
                    created_at?: string | null
                    date: string
                    description: string
                    id?: string
                    user_id: string
                }
                Update: {
                    amount?: number
                    category?: string
                    created_at?: string | null
                    date?: string
                    description?: string
                    id?: string
                    user_id?: string
                }
                Relationships: []
            }
            income_sources: {
                Row: {
                    amount: number
                    created_at: string | null
                    frequency: string
                    id: string
                    name: string
                    user_id: string
                }
                Insert: {
                    amount: number
                    created_at?: string | null
                    frequency: string
                    id?: string
                    name: string
                    user_id: string
                }
                Update: {
                    amount?: number
                    created_at?: string | null
                    frequency?: string
                    id?: string
                    name?: string
                    user_id?: string
                }
                Relationships: []
            }
            protocol_phases: {
                Row: {
                    description: string | null
                    duration_days: number
                    id: string
                    name: string
                    order_index: number
                    protocol_id: string
                    type: string
                }
                Insert: {
                    description?: string | null
                    duration_days?: number
                    id?: string
                    name: string
                    order_index: number
                    protocol_id: string
                    type: string
                }
                Update: {
                    description?: string | null
                    duration_days?: number
                    id?: string
                    name?: string
                    order_index?: number
                    protocol_id?: string
                    type?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "protocol_phases_protocol_id_fkey"
                        columns: ["protocol_id"]
                        isOneToOne: false
                        referencedRelation: "protocols"
                        referencedColumns: ["id"]
                    },
                ]
            }
            protocols: {
                Row: {
                    created_at: string | null
                    description: string | null
                    hypothesis: string | null
                    id: string
                    status: string | null
                    title: string
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    hypothesis?: string | null
                    id?: string
                    status?: string | null
                    title: string
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    hypothesis?: string | null
                    id?: string
                    status?: string | null
                    title?: string
                    updated_at?: string | null
                    user_id?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: "public" },
    TableName extends PublicTableNameOrOptions extends { schema: "public" }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: "public" }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: "public" },
    TableName extends PublicTableNameOrOptions extends { schema: "public" }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: "public" }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: "public" },
    TableName extends PublicTableNameOrOptions extends { schema: "public" }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: "public" }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: "public" },
    EnumName extends PublicEnumNameOrOptions extends { schema: "public" }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: "public" }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: "public" },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: "public"
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: "public" }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
