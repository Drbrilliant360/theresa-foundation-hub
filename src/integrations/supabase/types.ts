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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      campaigns: {
        Row: {
          category: string
          created_at: string
          description: string
          donor_count: number
          end_date: string | null
          featured: boolean
          goal_amount: number
          id: string
          image_key: string
          raised_amount: number
          slug: string
          start_date: string
          status: Database["public"]["Enums"]["campaign_status"]
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          donor_count?: number
          end_date?: string | null
          featured?: boolean
          goal_amount?: number
          id?: string
          image_key?: string
          raised_amount?: number
          slug: string
          start_date?: string
          status?: Database["public"]["Enums"]["campaign_status"]
          summary?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          donor_count?: number
          end_date?: string | null
          featured?: boolean
          goal_amount?: number
          id?: string
          image_key?: string
          raised_amount?: number
          slug?: string
          start_date?: string
          status?: Database["public"]["Enums"]["campaign_status"]
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          anonymous: boolean
          campaign_id: string | null
          country: string
          created_at: string
          donor_email: string
          donor_name: string
          donor_phone: string | null
          frequency: Database["public"]["Enums"]["donation_frequency"]
          id: string
          payment_method: string
          reference: string
          status: Database["public"]["Enums"]["donation_status"]
          user_id: string | null
        }
        Insert: {
          amount: number
          anonymous?: boolean
          campaign_id?: string | null
          country?: string
          created_at?: string
          donor_email: string
          donor_name: string
          donor_phone?: string | null
          frequency?: Database["public"]["Enums"]["donation_frequency"]
          id?: string
          payment_method?: string
          reference?: string
          status?: Database["public"]["Enums"]["donation_status"]
          user_id?: string | null
        }
        Update: {
          amount?: number
          anonymous?: boolean
          campaign_id?: string | null
          country?: string
          created_at?: string
          donor_email?: string
          donor_name?: string
          donor_phone?: string | null
          frequency?: Database["public"]["Enums"]["donation_frequency"]
          id?: string
          payment_method?: string
          reference?: string
          status?: Database["public"]["Enums"]["donation_status"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          id: string
          question: string
          sort_order: number
        }
        Insert: {
          answer: string
          id?: string
          question: string
          sort_order?: number
        }
        Update: {
          answer?: string
          id?: string
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          category: string
          created_at: string
          id: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string
          category?: string
          created_at?: string
          id?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string
          category?: string
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          country: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          amount: number | null
          id: string
          name: string
          published: boolean
          role: string
          sort_order: number
          story: string
        }
        Insert: {
          amount?: number | null
          id?: string
          name: string
          published?: boolean
          role?: string
          sort_order?: number
          story: string
        }
        Update: {
          amount?: number | null
          id?: string
          name?: string
          published?: boolean
          role?: string
          sort_order?: number
          story?: string
        }
        Relationships: []
      }
      tshirt_inventory: {
        Row: {
          id: string
          quantity_available: number
          size: Database["public"]["Enums"]["tshirt_size"]
          template_id: string
        }
        Insert: {
          id?: string
          quantity_available?: number
          size: Database["public"]["Enums"]["tshirt_size"]
          template_id: string
        }
        Update: {
          id?: string
          quantity_available?: number
          size?: Database["public"]["Enums"]["tshirt_size"]
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tshirt_inventory_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "tshirt_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      tshirt_orders: {
        Row: {
          created_at: string
          donation_id: string
          id: string
          quantity: number
          size: Database["public"]["Enums"]["tshirt_size"]
          status: Database["public"]["Enums"]["order_status"]
          template_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          donation_id: string
          id?: string
          quantity?: number
          size: Database["public"]["Enums"]["tshirt_size"]
          status?: Database["public"]["Enums"]["order_status"]
          template_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          donation_id?: string
          id?: string
          quantity?: number
          size?: Database["public"]["Enums"]["tshirt_size"]
          status?: Database["public"]["Enums"]["order_status"]
          template_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tshirt_orders_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tshirt_orders_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "tshirt_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      tshirt_templates: {
        Row: {
          active: boolean
          created_at: string
          description: string
          id: string
          image_key: string
          min_donation_amount: number
          name: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          image_key?: string
          min_donation_amount?: number
          name: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          image_key?: string
          min_donation_amount?: number
          name?: string
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "donor" | "admin"
      campaign_status: "draft" | "active" | "paused" | "completed"
      donation_frequency: "one_time" | "monthly"
      donation_status: "pending" | "completed" | "failed" | "refunded"
      order_status:
        | "confirmed"
        | "reserved"
        | "processing"
        | "ready"
        | "shipped"
        | "delivered"
      tshirt_size: "XS" | "S" | "M" | "L" | "XL" | "XXL"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["donor", "admin"],
      campaign_status: ["draft", "active", "paused", "completed"],
      donation_frequency: ["one_time", "monthly"],
      donation_status: ["pending", "completed", "failed", "refunded"],
      order_status: [
        "confirmed",
        "reserved",
        "processing",
        "ready",
        "shipped",
        "delivered",
      ],
      tshirt_size: ["XS", "S", "M", "L", "XL", "XXL"],
    },
  },
} as const
