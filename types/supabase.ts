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
                Relationships: [
                    {
                        foreignKeyName: "assets_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            biometrics: {
                Row: {
                    body_battery: number | null
                    date: string
                    hrv_status: string | null
                    last_synced_at: string | null
                    resting_hr: number | null
                    sleep_score: number | null
                    user_id: string
                }
                Insert: {
                    body_battery?: number | null
                    date: string
                    hrv_status?: string | null
                    last_synced_at?: string | null
                    resting_hr?: number | null
                    sleep_score?: number | null
                    user_id: string
                }
                Update: {
                    body_battery?: number | null
                    date?: string
                    hrv_status?: string | null
                    last_synced_at?: string | null
                    resting_hr?: number | null
                    sleep_score?: number | null
                    user_id?: string
                }
                Relationships: []
            }
            garmin_activities: {
                Row: {
                    activity_id: number
                    activity_type: string | null
                    avg_hr: number | null
                    avg_speed_mps: number | null
                    calories: number | null
                    detailed_json: Json | null
                    distance_meters: number | null
                    duration_seconds: number | null
                    elevation_gain_meters: number | null
                    max_hr: number | null
                    max_speed_mps: number | null
                    name: string | null
                    start_time: string
                    steps: number | null
                    user_id: string
                }
                Insert: {
                    activity_id: number
                    activity_type?: string | null
                    avg_hr?: number | null
                    avg_speed_mps?: number | null
                    calories?: number | null
                    detailed_json?: Json | null
                    distance_meters?: number | null
                    duration_seconds?: number | null
                    elevation_gain_meters?: number | null
                    max_hr?: number | null
                    max_speed_mps?: number | null
                    name?: string | null
                    start_time: string
                    steps?: number | null
                    user_id: string
                }
                Update: {
                    activity_id?: number
                    activity_type?: string | null
                    avg_hr?: number | null
                    avg_speed_mps?: number | null
                    calories?: number | null
                    detailed_json?: Json | null
                    distance_meters?: number | null
                    duration_seconds?: number | null
                    elevation_gain_meters?: number | null
                    max_hr?: number | null
                    max_speed_mps?: number | null
                    name?: string | null
                    start_time?: string
                    steps?: number | null
                    user_id?: string
                }
                Relationships: []
            }
            garmin_daily_metrics: {
                Row: {
                    body_battery_max: number | null
                    body_battery_min: number | null
                    calories_active: number | null
                    calories_consumed: number | null
                    date: string
                    deep_sleep_seconds: number | null
                    floors_climbed: number | null
                    light_sleep_seconds: number | null
                    max_hr: number | null
                    rem_sleep_seconds: number | null
                    resting_hr: number | null
                    sleep_score: number | null
                    sleep_seconds: number | null
                    stress_avg: number | null
                    total_distance_meters: number | null
                    total_steps: number | null
                    user_id: string
                }
                Insert: {
                    body_battery_max?: number | null
                    body_battery_min?: number | null
                    calories_active?: number | null
                    calories_consumed?: number | null
                    date: string
                    deep_sleep_seconds?: number | null
                    floors_climbed?: number | null
                    light_sleep_seconds?: number | null
                    max_hr?: number | null
                    rem_sleep_seconds?: number | null
                    resting_hr?: number | null
                    sleep_score?: number | null
                    sleep_seconds?: number | null
                    stress_avg?: number | null
                    total_distance_meters?: number | null
                    total_steps?: number | null
                    user_id: string
                }
                Update: {
                    body_battery_max?: number | null
                    body_battery_min?: number | null
                    calories_active?: number | null
                    calories_consumed?: number | null
                    date?: string
                    deep_sleep_seconds?: number | null
                    floors_climbed?: number | null
                    light_sleep_seconds?: number | null
                    max_hr?: number | null
                    rem_sleep_seconds?: number | null
                    resting_hr?: number | null
                    sleep_score?: number | null
                    sleep_seconds?: number | null
                    stress_avg?: number | null
                    total_distance_meters?: number | null
                    total_steps?: number | null
                    user_id?: string
                }
                Relationships: []
            }
            garmin_gear: {
                Row: {
                    brand: string | null
                    date_added: string | null
                    model: string | null
                    name: string | null
                    status: string | null
                    total_distance_meters: number | null
                    type_key: string | null
                    user_id: string
                    uuid: string
                }
                Insert: {
                    brand?: string | null
                    date_added?: string | null
                    model?: string | null
                    name?: string | null
                    status?: string | null
                    total_distance_meters?: number | null
                    type_key?: string | null
                    user_id: string
                    uuid: string
                }
                Update: {
                    brand?: string | null
                    date_added?: string | null
                    model?: string | null
                    name?: string | null
                    status?: string | null
                    total_distance_meters?: number | null
                    type_key?: string | null
                    user_id?: string
                    uuid?: string
                }
                Relationships: []
            }
            garmin_hrv: {
                Row: {
                    baseline_high_ms: number | null
                    baseline_low_ms: number | null
                    date: string
                    last_night_5min_max_ms: number | null
                    nightly_avg_ms: number | null
                    status: string | null
                    user_id: string
                }
                Insert: {
                    baseline_high_ms?: number | null
                    baseline_low_ms?: number | null
                    date: string
                    last_night_5min_max_ms?: number | null
                    nightly_avg_ms?: number | null
                    status?: string | null
                    user_id: string
                }
                Update: {
                    baseline_high_ms?: number | null
                    baseline_low_ms?: number | null
                    date?: string
                    last_night_5min_max_ms?: number | null
                    nightly_avg_ms?: number | null
                    status?: string | null
                    user_id?: string
                }
                Relationships: []
            }
            garmin_weight: {
                Row: {
                    bmi: number | null
                    body_fat_percent: number | null
                    body_water_percent: number | null
                    bone_mass_kg: number | null
                    date: string
                    muscle_mass_kg: number | null
                    user_id: string
                    weight_kg: number | null
                }
                Insert: {
                    bmi?: number | null
                    body_fat_percent?: number | null
                    body_water_percent?: number | null
                    bone_mass_kg?: number | null
                    date: string
                    muscle_mass_kg?: number | null
                    user_id: string
                    weight_kg?: number | null
                }
                Update: {
                    bmi?: number | null
                    body_fat_percent?: number | null
                    body_water_percent?: number | null
                    bone_mass_kg?: number | null
                    date?: string
                    muscle_mass_kg?: number | null
                    user_id?: string
                    weight_kg?: number | null
                }
                Relationships: []
            }
            planned_workouts: {
                Row: {
                    description: string | null
                    end_time: string | null
                    id: number
                    is_completed: boolean | null
                    notification_sent: boolean | null
                    start_time: string
                    title: string
                    user_id: string
                }
                Insert: {
                    description?: string | null
                    end_time?: string | null
                    id?: number
                    is_completed?: boolean | null
                    notification_sent?: boolean | null
                    start_time: string
                    title: string
                    user_id: string
                }
                Update: {
                    description?: string | null
                    end_time?: string | null
                    id?: number
                    is_completed?: boolean | null
                    notification_sent?: boolean | null
                    start_time?: string
                    title?: string
                    user_id?: string
                }
                Relationships: []
            }
            portfolio: {
                Row: {
                    allocation_target: number | null
                    asset_class: string
                    current_value: number
                    id: string
                    last_updated: string | null
                    name: string
                    ticker: string
                    user_id: string
                }
                Insert: {
                    allocation_target?: number | null
                    asset_class: string
                    current_value: number
                    id?: string
                    last_updated?: string | null
                    name: string
                    ticker: string
                    user_id: string
                }
                Update: {
                    allocation_target?: number | null
                    asset_class?: string
                    current_value?: number
                    id?: string
                    last_updated?: string | null
                    name?: string
                    ticker?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "portfolio_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string | null
                    email: string
                    full_name: string | null
                    id: string
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email: string
                    full_name?: string | null
                    id: string
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email?: string
                    full_name?: string | null
                    id?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
            properties: {
                Row: {
                    address: string
                    cost_price: number
                    current_value: number
                    id: string
                    purchase_date: string
                    rental_yield: number | null
                    user_id: string
                }
                Insert: {
                    address: string
                    cost_price: number
                    current_value: number
                    id?: string
                    purchase_date: string
                    rental_yield?: number | null
                    user_id: string
                }
                Update: {
                    address?: string
                    cost_price?: number
                    current_value?: number
                    id?: string
                    purchase_date?: string
                    rental_yield?: number | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "properties_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            push_subscriptions: {
                Row: {
                    auth: string
                    endpoint: string
                    id: number
                    p256dh: string
                    user_id: string
                }
                Insert: {
                    auth: string
                    endpoint: string
                    id?: number
                    p256dh: string
                    user_id: string
                }
                Update: {
                    auth?: string
                    endpoint?: string
                    id?: number
                    p256dh?: string
                    user_id?: string
                }
                Relationships: []
            }
            tax_records: {
                Row: {
                    amount: number
                    category: string
                    date: string
                    description: string | null
                    id: string
                    tax_year: number
                    type: string
                    user_id: string
                }
                Insert: {
                    amount: number
                    category: string
                    date: string
                    description?: string | null
                    id?: string
                    tax_year: number
                    type: string
                    user_id: string
                }
                Update: {
                    amount?: number
                    category?: string
                    date?: string
                    description?: string | null
                    id?: string
                    tax_year?: number
                    type?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tax_records_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            transactions: {
                Row: {
                    amount: number
                    category: string
                    date: string
                    description: string
                    id: string
                    is_recurring: boolean | null
                    type: string
                    user_id: string
                }
                Insert: {
                    amount: number
                    category: string
                    date: string
                    description: string
                    id?: string
                    is_recurring?: boolean | null
                    type: string
                    user_id: string
                }
                Update: {
                    amount?: number
                    category?: string
                    date?: string
                    description?: string
                    id?: string
                    is_recurring?: boolean | null
                    type?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "transactions_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            workout_memory: {
                Row: {
                    embedding: string | null
                    id: number
                    summary_text: string | null
                    workout_id: number | null
                }
                Insert: {
                    embedding?: string | null
                    id?: number
                    summary_text?: string | null
                    workout_id?: number | null
                }
                Update: {
                    embedding?: string | null
                    id?: number
                    summary_text?: string | null
                    workout_id?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "workout_memory_workout_id_fkey"
                        columns: ["workout_id"]
                        isOneToOne: false
                        referencedRelation: "planned_workouts"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            binary_quantize:
            | {
                Args: {
                    "": string
                }
                Returns: string
            }
            | {
                Args: {
                    "": string
                }
                Returns: string
            }
            halfvec_avg: {
                Args: {
                    "": number[]
                }
                Returns: unknown
            }
            halfvec_out: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            halfvec_send: {
                Args: {
                    "": unknown
                }
                Returns: string
            }
            halfvec_typmod_in: {
                Args: {
                    "": unknown[]
                }
                Returns: number
            }
            halfvec_typmod_out: {
                Args: {
                    "": number
                }
                Returns: unknown
            }
            hnsw_bit_support: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            hnsw_halfvec_support: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            hnsw_sparsevec_support: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            hnswhandler: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            ivfflat_bit_support: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            ivfflat_halfvec_support: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            ivfflathandler: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            l2_norm:
            | {
                Args: {
                    "": unknown
                }
                Returns: number
            }
            | {
                Args: {
                    "": unknown
                }
                Returns: number
            }
            l2_normalize:
            | {
                Args: {
                    "": string
                }
                Returns: string
            }
            | {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            | {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            sparsevec_out: {
                Args: {
                    "": unknown
                }
                Returns: unknown
            }
            sparsevec_send: {
                Args: {
                    "": unknown
                }
                Returns: string
            }
            sparsevec_typmod_in: {
                Args: {
                    "": unknown[]
                }
                Returns: number
            }
            sparsevec_typmod_out: {
                Args: {
                    "": number
                }
                Returns: unknown
            }
            vector_avg: {
                Args: {
                    "": number[]
                }
                Returns: string
            }
            vector_dims:
            | {
                Args: {
                    "": string
                }
                Returns: number
            }
            | {
                Args: {
                    "": unknown
                }
                Returns: number
            }
            vector_norm: {
                Args: {
                    "": string
                }
                Returns: number
            }
            vector_out: {
                Args: {
                    "": string
                }
                Returns: unknown
            }
            vector_send: {
                Args: {
                    "": string
                }
                Returns: string
            }
            vector_typmod_in: {
                Args: {
                    "": unknown[]
                }
                Returns: number
            }
            vector_typmod_out: {
                Args: {
                    "": number
                }
                Returns: unknown
            }
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
    | { schema: keyof Omit<Database, "__InternalSupabase"> },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Omit<Database, "__InternalSupabase"> }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Omit<Database, "__InternalSupabase"> }
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
    | { schema: keyof Omit<Database, "__InternalSupabase"> },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Omit<Database, "__InternalSupabase"> }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Omit<Database, "__InternalSupabase"> }
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
    | { schema: keyof Omit<Database, "__InternalSupabase"> },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Omit<Database, "__InternalSupabase"> }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Omit<Database, "__InternalSupabase"> }
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
    | { schema: keyof Omit<Database, "__InternalSupabase"> },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Omit<Database, "__InternalSupabase"> }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Omit<Database, "__InternalSupabase"> }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Omit<Database, "__InternalSupabase"> },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Omit<Database, "__InternalSupabase">
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Omit<Database, "__InternalSupabase"> }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {},
    },
} as const
