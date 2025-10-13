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
      activity_feed: {
        Row: {
          created_at: string | null
          data: Json | null
          description: string | null
          id: string
          timestamp: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          description?: string | null
          id?: string
          timestamp?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          description?: string | null
          id?: string
          timestamp?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      agent_performance_metrics: {
        Row: {
          agent_id: string
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          recorded_at: string
          time_window: string
        }
        Insert: {
          agent_id: string
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          recorded_at?: string
          time_window: string
        }
        Update: {
          agent_id?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          recorded_at?: string
          time_window?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_performance_metrics_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_specializations: {
        Row: {
          agent_id: string
          detected_at: string
          id: string
          last_updated: string
          metadata: Json | null
          proficiency_score: number
          specialization_area: string
          success_rate: number
          tasks_completed_in_area: number
        }
        Insert: {
          agent_id: string
          detected_at?: string
          id?: string
          last_updated?: string
          metadata?: Json | null
          proficiency_score?: number
          specialization_area: string
          success_rate?: number
          tasks_completed_in_area?: number
        }
        Update: {
          agent_id?: string
          detected_at?: string
          id?: string
          last_updated?: string
          metadata?: Json | null
          proficiency_score?: number
          specialization_area?: string
          success_rate?: number
          tasks_completed_in_area?: number
        }
        Relationships: [
          {
            foreignKeyName: "agent_specializations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          created_at: string
          id: string
          name: string
          role: string
          skills: Json
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          role: string
          skills?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          role?: string
          skills?: Json
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      api_call_logs: {
        Row: {
          called_at: string
          caller_context: Json | null
          created_at: string
          error_message: string | null
          execution_time_ms: number | null
          function_name: string
          id: string
          request_payload: Json | null
          response_data: Json | null
          status: string
        }
        Insert: {
          called_at?: string
          caller_context?: Json | null
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          function_name: string
          id?: string
          request_payload?: Json | null
          response_data?: Json | null
          status: string
        }
        Update: {
          called_at?: string
          caller_context?: Json | null
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          function_name?: string
          id?: string
          request_payload?: Json | null
          response_data?: Json | null
          status?: string
        }
        Relationships: []
      }
      api_key_health: {
        Row: {
          created_at: string | null
          days_until_expiry: number | null
          error_message: string | null
          expiry_warning: boolean | null
          id: string
          is_healthy: boolean
          key_type: string | null
          last_checked: string | null
          metadata: Json | null
          service_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          days_until_expiry?: number | null
          error_message?: string | null
          expiry_warning?: boolean | null
          id?: string
          is_healthy?: boolean
          key_type?: string | null
          last_checked?: string | null
          metadata?: Json | null
          service_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          days_until_expiry?: number | null
          error_message?: string | null
          expiry_warning?: boolean | null
          id?: string
          is_healthy?: boolean
          key_type?: string | null
          last_checked?: string | null
          metadata?: Json | null
          service_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      autonomous_actions_log: {
        Row: {
          action_details: Json
          action_timestamp: string
          action_type: string
          confidence_score: number | null
          created_at: string
          id: string
          impact_assessment: Json | null
          learning_notes: string | null
          metadata: Json | null
          outcome: string
          trigger_reason: string
        }
        Insert: {
          action_details: Json
          action_timestamp?: string
          action_type: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          impact_assessment?: Json | null
          learning_notes?: string | null
          metadata?: Json | null
          outcome: string
          trigger_reason: string
        }
        Update: {
          action_details?: Json
          action_timestamp?: string
          action_type?: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          impact_assessment?: Json | null
          learning_notes?: string | null
          metadata?: Json | null
          outcome?: string
          trigger_reason?: string
        }
        Relationships: []
      }
      battery_health_snapshots: {
        Row: {
          assessed_at: string
          average_charging_speed: string | null
          charging_efficiency: number | null
          charging_streak_days: number | null
          created_at: string
          degradation_level: string | null
          device_id: string
          health_score: number
          id: string
          metadata: Json | null
          port_quality: string | null
          recommendations: Json | null
          temperature_impact: string | null
          total_charging_sessions: number | null
        }
        Insert: {
          assessed_at?: string
          average_charging_speed?: string | null
          charging_efficiency?: number | null
          charging_streak_days?: number | null
          created_at?: string
          degradation_level?: string | null
          device_id: string
          health_score: number
          id?: string
          metadata?: Json | null
          port_quality?: string | null
          recommendations?: Json | null
          temperature_impact?: string | null
          total_charging_sessions?: number | null
        }
        Update: {
          assessed_at?: string
          average_charging_speed?: string | null
          charging_efficiency?: number | null
          charging_streak_days?: number | null
          created_at?: string
          degradation_level?: string | null
          device_id?: string
          health_score?: number
          id?: string
          metadata?: Json | null
          port_quality?: string | null
          recommendations?: Json | null
          temperature_impact?: string | null
          total_charging_sessions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "battery_health_snapshots_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "active_devices_view"
            referencedColumns: ["device_id"]
          },
          {
            foreignKeyName: "battery_health_snapshots_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      battery_readings: {
        Row: {
          battery_level: number
          charging_speed: string | null
          charging_time_remaining: number | null
          created_at: string
          device_id: string
          discharging_time_remaining: number | null
          id: string
          is_charging: boolean
          metadata: Json | null
          session_id: string
          temperature_impact: string | null
          timestamp: string
        }
        Insert: {
          battery_level: number
          charging_speed?: string | null
          charging_time_remaining?: number | null
          created_at?: string
          device_id: string
          discharging_time_remaining?: number | null
          id?: string
          is_charging?: boolean
          metadata?: Json | null
          session_id: string
          temperature_impact?: string | null
          timestamp?: string
        }
        Update: {
          battery_level?: number
          charging_speed?: string | null
          charging_time_remaining?: number | null
          created_at?: string
          device_id?: string
          discharging_time_remaining?: number | null
          id?: string
          is_charging?: boolean
          metadata?: Json | null
          session_id?: string
          temperature_impact?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "battery_readings_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "active_devices_view"
            referencedColumns: ["device_id"]
          },
          {
            foreignKeyName: "battery_readings_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battery_readings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "battery_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      battery_sessions: {
        Row: {
          battery_level_end: number | null
          battery_level_start: number | null
          browser: string | null
          created_at: string
          device_id: string
          device_type: string | null
          ended_at: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          metadata: Json | null
          os: string | null
          session_key: string
          started_at: string
          updated_at: string
          was_charging: boolean | null
        }
        Insert: {
          battery_level_end?: number | null
          battery_level_start?: number | null
          browser?: string | null
          created_at?: string
          device_id: string
          device_type?: string | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          metadata?: Json | null
          os?: string | null
          session_key: string
          started_at?: string
          updated_at?: string
          was_charging?: boolean | null
        }
        Update: {
          battery_level_end?: number | null
          battery_level_start?: number | null
          browser?: string | null
          created_at?: string
          device_id?: string
          device_type?: string | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          metadata?: Json | null
          os?: string | null
          session_key?: string
          started_at?: string
          updated_at?: string
          was_charging?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "battery_sessions_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "active_devices_view"
            referencedColumns: ["device_id"]
          },
          {
            foreignKeyName: "battery_sessions_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      charging_sessions: {
        Row: {
          charging_speed: string | null
          created_at: string
          device_id: string
          duration_seconds: number | null
          efficiency_score: number | null
          end_level: number | null
          ended_at: string | null
          id: string
          metadata: Json | null
          optimization_mode: string | null
          port_quality: string | null
          session_id: string | null
          start_level: number
          started_at: string
        }
        Insert: {
          charging_speed?: string | null
          created_at?: string
          device_id: string
          duration_seconds?: number | null
          efficiency_score?: number | null
          end_level?: number | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          optimization_mode?: string | null
          port_quality?: string | null
          session_id?: string | null
          start_level: number
          started_at?: string
        }
        Update: {
          charging_speed?: string | null
          created_at?: string
          device_id?: string
          duration_seconds?: number | null
          efficiency_score?: number | null
          end_level?: number | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          optimization_mode?: string | null
          port_quality?: string | null
          session_id?: string | null
          start_level?: number
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "charging_sessions_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "active_devices_view"
            referencedColumns: ["device_id"]
          },
          {
            foreignKeyName: "charging_sessions_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charging_sessions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "battery_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          agent_id: string | null
          content: string
          created_at: string | null
          id: string
          message: string | null
          metadata: Json | null
          recipient: string | null
          role: string | null
          sender: string
          session_id: string | null
          thread_id: string | null
          timestamp: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          recipient?: string | null
          role?: string | null
          sender?: string
          session_id?: string | null
          thread_id?: string | null
          timestamp?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          recipient?: string | null
          role?: string | null
          sender?: string
          session_id?: string | null
          thread_id?: string | null
          timestamp?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          last_activity: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_activity?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_activity?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      community_messages: {
        Row: {
          author_id: string | null
          author_name: string | null
          auto_response_queued: boolean | null
          content: string
          created_at: string | null
          flag_reason: string | null
          flagged_for_review: boolean | null
          id: string
          metadata: Json | null
          platform: string
          platform_message_id: string | null
          processed: boolean | null
          sentiment_score: number | null
          topics: string[] | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          auto_response_queued?: boolean | null
          content: string
          created_at?: string | null
          flag_reason?: string | null
          flagged_for_review?: boolean | null
          id?: string
          metadata?: Json | null
          platform: string
          platform_message_id?: string | null
          processed?: boolean | null
          sentiment_score?: number | null
          topics?: string[] | null
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          auto_response_queued?: boolean | null
          content?: string
          created_at?: string | null
          flag_reason?: string | null
          flagged_for_review?: boolean | null
          id?: string
          metadata?: Json | null
          platform?: string
          platform_message_id?: string | null
          processed?: boolean | null
          sentiment_score?: number | null
          topics?: string[] | null
        }
        Relationships: []
      }
      community_responses: {
        Row: {
          approved: boolean | null
          approved_by: string | null
          created_at: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          platform_response_id: string | null
          response_content: string
          response_type: string
          sent_at: string | null
        }
        Insert: {
          approved?: boolean | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          platform_response_id?: string | null
          response_content: string
          response_type: string
          sent_at?: string | null
        }
        Update: {
          approved?: boolean | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          platform_response_id?: string | null
          response_content?: string
          response_type?: string
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_responses_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "community_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_history: {
        Row: {
          conversation_title: string | null
          created_at: string
          id: string
          is_active: boolean | null
          last_activity_at: string
          message_count: number | null
          metadata: Json | null
          participant_type: string
          session_id: string
          session_key: string
          started_at: string
          updated_at: string
        }
        Insert: {
          conversation_title?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_activity_at?: string
          message_count?: number | null
          metadata?: Json | null
          participant_type?: string
          session_id: string
          session_key: string
          started_at?: string
          updated_at?: string
        }
        Update: {
          conversation_title?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_activity_at?: string
          message_count?: number | null
          metadata?: Json | null
          participant_type?: string
          session_id?: string
          session_key?: string
          started_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_messages: {
        Row: {
          content: string
          id: string
          message_type: string
          metadata: Json | null
          processing_data: Json | null
          session_id: string
          timestamp: string
        }
        Insert: {
          content: string
          id?: string
          message_type: string
          metadata?: Json | null
          processing_data?: Json | null
          session_id: string
          timestamp?: string
        }
        Update: {
          content?: string
          id?: string
          message_type?: string
          metadata?: Json | null
          processing_data?: Json | null
          session_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_sessions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          metadata: Json | null
          session_key: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          session_key: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          session_key?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      conversation_summaries: {
        Row: {
          created_at: string
          end_message_id: string | null
          id: string
          message_count: number
          metadata: Json | null
          session_id: string
          start_message_id: string | null
          summary_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_message_id?: string | null
          id?: string
          message_count?: number
          metadata?: Json | null
          session_id: string
          start_message_id?: string | null
          summary_text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_message_id?: string | null
          id?: string
          message_count?: number
          metadata?: Json | null
          session_id?: string
          start_message_id?: string | null
          summary_text?: string
          updated_at?: string
        }
        Relationships: []
      }
      dao_members: {
        Row: {
          created_at: string
          devices: string[] | null
          id: string
          ip_addresses: Json | null
          is_active: boolean | null
          member_since: string
          metadata: Json | null
          reputation_score: number | null
          total_contributions: number | null
          updated_at: string
          voting_power: number | null
          wallet_address: string
          worker_ids: string[] | null
        }
        Insert: {
          created_at?: string
          devices?: string[] | null
          id?: string
          ip_addresses?: Json | null
          is_active?: boolean | null
          member_since?: string
          metadata?: Json | null
          reputation_score?: number | null
          total_contributions?: number | null
          updated_at?: string
          voting_power?: number | null
          wallet_address: string
          worker_ids?: string[] | null
        }
        Update: {
          created_at?: string
          devices?: string[] | null
          id?: string
          ip_addresses?: Json | null
          is_active?: boolean | null
          member_since?: string
          metadata?: Json | null
          reputation_score?: number | null
          total_contributions?: number | null
          updated_at?: string
          voting_power?: number | null
          wallet_address?: string
          worker_ids?: string[] | null
        }
        Relationships: []
      }
      decisions: {
        Row: {
          agent_id: string | null
          created_at: string
          decision: string
          id: string
          rationale: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          decision: string
          id: string
          rationale: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          decision?: string
          id?: string
          rationale?: string
        }
        Relationships: [
          {
            foreignKeyName: "decisions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      device_activity_log: {
        Row: {
          activity_type: string
          category: Database["public"]["Enums"]["activity_category"]
          created_at: string | null
          description: string
          details: Json | null
          device_id: string
          id: string
          is_anomaly: boolean | null
          is_pop_eligible: boolean | null
          metadata: Json | null
          occurred_at: string
          pop_points: number | null
          processed_at: string | null
          session_id: string | null
          severity: Database["public"]["Enums"]["activity_severity"] | null
          tags: string[] | null
          user_id: string | null
          wallet_address: string | null
        }
        Insert: {
          activity_type: string
          category: Database["public"]["Enums"]["activity_category"]
          created_at?: string | null
          description: string
          details?: Json | null
          device_id: string
          id?: string
          is_anomaly?: boolean | null
          is_pop_eligible?: boolean | null
          metadata?: Json | null
          occurred_at?: string
          pop_points?: number | null
          processed_at?: string | null
          session_id?: string | null
          severity?: Database["public"]["Enums"]["activity_severity"] | null
          tags?: string[] | null
          user_id?: string | null
          wallet_address?: string | null
        }
        Update: {
          activity_type?: string
          category?: Database["public"]["Enums"]["activity_category"]
          created_at?: string | null
          description?: string
          details?: Json | null
          device_id?: string
          id?: string
          is_anomaly?: boolean | null
          is_pop_eligible?: boolean | null
          metadata?: Json | null
          occurred_at?: string
          pop_points?: number | null
          processed_at?: string | null
          session_id?: string | null
          severity?: Database["public"]["Enums"]["activity_severity"] | null
          tags?: string[] | null
          user_id?: string | null
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "device_activity_log_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "active_devices_view"
            referencedColumns: ["device_id"]
          },
          {
            foreignKeyName: "device_activity_log_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "device_activity_log_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "active_devices_view"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "device_activity_log_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "device_connection_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      device_connection_sessions: {
        Row: {
          app_version: string | null
          battery_level_end: number | null
          battery_level_start: number | null
          charging_sessions_count: number | null
          commands_executed: number | null
          commands_received: number | null
          connected_at: string
          created_at: string | null
          device_id: string
          disconnected_at: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_heartbeat: string
          metadata: Json | null
          session_key: string
          total_duration_seconds: number | null
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          app_version?: string | null
          battery_level_end?: number | null
          battery_level_start?: number | null
          charging_sessions_count?: number | null
          commands_executed?: number | null
          commands_received?: number | null
          connected_at?: string
          created_at?: string | null
          device_id: string
          disconnected_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_heartbeat?: string
          metadata?: Json | null
          session_key: string
          total_duration_seconds?: number | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          app_version?: string | null
          battery_level_end?: number | null
          battery_level_start?: number | null
          charging_sessions_count?: number | null
          commands_executed?: number | null
          commands_received?: number | null
          connected_at?: string
          created_at?: string | null
          device_id?: string
          disconnected_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_heartbeat?: string
          metadata?: Json | null
          session_key?: string
          total_duration_seconds?: number | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "device_connection_sessions_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "active_devices_view"
            referencedColumns: ["device_id"]
          },
          {
            foreignKeyName: "device_connection_sessions_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      device_metrics_summary: {
        Row: {
          active_devices_count: number | null
          avg_charging_efficiency: number | null
          avg_session_duration_seconds: number | null
          created_at: string | null
          detailed_metrics: Json | null
          id: string
          summary_date: string
          summary_hour: number | null
          top_device_ids: string[] | null
          top_event_types: string[] | null
          total_anomalies_detected: number | null
          total_charging_sessions: number | null
          total_commands_executed: number | null
          total_commands_issued: number | null
          total_connections: number | null
          total_pop_points_earned: number | null
          updated_at: string | null
        }
        Insert: {
          active_devices_count?: number | null
          avg_charging_efficiency?: number | null
          avg_session_duration_seconds?: number | null
          created_at?: string | null
          detailed_metrics?: Json | null
          id?: string
          summary_date?: string
          summary_hour?: number | null
          top_device_ids?: string[] | null
          top_event_types?: string[] | null
          total_anomalies_detected?: number | null
          total_charging_sessions?: number | null
          total_commands_executed?: number | null
          total_commands_issued?: number | null
          total_connections?: number | null
          total_pop_points_earned?: number | null
          updated_at?: string | null
        }
        Update: {
          active_devices_count?: number | null
          avg_charging_efficiency?: number | null
          avg_session_duration_seconds?: number | null
          created_at?: string | null
          detailed_metrics?: Json | null
          id?: string
          summary_date?: string
          summary_hour?: number | null
          top_device_ids?: string[] | null
          top_event_types?: string[] | null
          total_anomalies_detected?: number | null
          total_charging_sessions?: number | null
          total_commands_executed?: number | null
          total_commands_issued?: number | null
          total_connections?: number | null
          total_pop_points_earned?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      device_miner_associations: {
        Row: {
          associated_at: string
          association_method: string | null
          created_at: string
          device_id: string
          id: string
          is_primary_device: boolean | null
          metadata: Json | null
          mining_while_charging: boolean | null
          total_sessions_while_mining: number | null
          updated_at: string
          wallet_address: string | null
          worker_id: string
        }
        Insert: {
          associated_at?: string
          association_method?: string | null
          created_at?: string
          device_id: string
          id?: string
          is_primary_device?: boolean | null
          metadata?: Json | null
          mining_while_charging?: boolean | null
          total_sessions_while_mining?: number | null
          updated_at?: string
          wallet_address?: string | null
          worker_id: string
        }
        Update: {
          associated_at?: string
          association_method?: string | null
          created_at?: string
          device_id?: string
          id?: string
          is_primary_device?: boolean | null
          metadata?: Json | null
          mining_while_charging?: boolean | null
          total_sessions_while_mining?: number | null
          updated_at?: string
          wallet_address?: string | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_miner_associations_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "active_devices_view"
            referencedColumns: ["device_id"]
          },
          {
            foreignKeyName: "device_miner_associations_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          browser: string | null
          created_at: string
          device_fingerprint: string
          device_type: string | null
          first_seen_at: string
          id: string
          ip_addresses: Json | null
          is_active: boolean | null
          last_seen_at: string
          metadata: Json | null
          os: string | null
          session_keys: string[] | null
          updated_at: string
          wallet_address: string | null
          worker_id: string | null
        }
        Insert: {
          browser?: string | null
          created_at?: string
          device_fingerprint: string
          device_type?: string | null
          first_seen_at?: string
          id?: string
          ip_addresses?: Json | null
          is_active?: boolean | null
          last_seen_at?: string
          metadata?: Json | null
          os?: string | null
          session_keys?: string[] | null
          updated_at?: string
          wallet_address?: string | null
          worker_id?: string | null
        }
        Update: {
          browser?: string | null
          created_at?: string
          device_fingerprint?: string
          device_type?: string | null
          first_seen_at?: string
          id?: string
          ip_addresses?: Json | null
          is_active?: boolean | null
          last_seen_at?: string
          metadata?: Json | null
          os?: string | null
          session_keys?: string[] | null
          updated_at?: string
          wallet_address?: string | null
          worker_id?: string | null
        }
        Relationships: []
      }
      eliza_activity_log: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          mentioned_to_user: boolean | null
          metadata: Json | null
          status: string | null
          title: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          mentioned_to_user?: boolean | null
          metadata?: Json | null
          status?: string | null
          title: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          mentioned_to_user?: boolean | null
          metadata?: Json | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      eliza_python_executions: {
        Row: {
          code: string
          created_at: string | null
          error: string | null
          execution_time_ms: number | null
          exit_code: number | null
          id: string
          output: string | null
          purpose: string | null
          source: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          error?: string | null
          execution_time_ms?: number | null
          exit_code?: number | null
          id?: string
          output?: string | null
          purpose?: string | null
          source?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          error?: string | null
          execution_time_ms?: number | null
          exit_code?: number | null
          id?: string
          output?: string | null
          purpose?: string | null
          source?: string | null
        }
        Relationships: []
      }
      eliza_python_executions_archive: {
        Row: {
          code: string
          created_at: string | null
          error: string | null
          execution_time_ms: number | null
          exit_code: number | null
          id: string
          output: string | null
          purpose: string | null
          source: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          error?: string | null
          execution_time_ms?: number | null
          exit_code?: number | null
          id?: string
          output?: string | null
          purpose?: string | null
          source?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          error?: string | null
          execution_time_ms?: number | null
          exit_code?: number | null
          id?: string
          output?: string | null
          purpose?: string | null
          source?: string | null
        }
        Relationships: []
      }
      engagement_commands: {
        Row: {
          acknowledged_at: string | null
          command_payload: Json
          command_type: Database["public"]["Enums"]["command_type"]
          created_at: string | null
          device_id: string | null
          error_message: string | null
          executed_at: string | null
          execution_result: Json | null
          expires_at: string | null
          id: string
          issued_at: string
          issued_by: string | null
          metadata: Json | null
          priority: number | null
          sent_at: string | null
          session_id: string | null
          status: Database["public"]["Enums"]["command_status"] | null
          target_all: boolean | null
          updated_at: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          command_payload: Json
          command_type: Database["public"]["Enums"]["command_type"]
          created_at?: string | null
          device_id?: string | null
          error_message?: string | null
          executed_at?: string | null
          execution_result?: Json | null
          expires_at?: string | null
          id?: string
          issued_at?: string
          issued_by?: string | null
          metadata?: Json | null
          priority?: number | null
          sent_at?: string | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["command_status"] | null
          target_all?: boolean | null
          updated_at?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          command_payload?: Json
          command_type?: Database["public"]["Enums"]["command_type"]
          created_at?: string | null
          device_id?: string | null
          error_message?: string | null
          executed_at?: string | null
          execution_result?: Json | null
          expires_at?: string | null
          id?: string
          issued_at?: string
          issued_by?: string | null
          metadata?: Json | null
          priority?: number | null
          sent_at?: string | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["command_status"] | null
          target_all?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_commands_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "active_devices_view"
            referencedColumns: ["device_id"]
          },
          {
            foreignKeyName: "engagement_commands_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_commands_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "active_devices_view"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "engagement_commands_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "device_connection_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_relationships: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          relationship_type: string
          source_entity_id: string
          strength: number | null
          target_entity_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          relationship_type: string
          source_entity_id: string
          strength?: number | null
          target_entity_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          relationship_type?: string
          source_entity_id?: string
          strength?: number | null
          target_entity_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_relationships_source_entity_id_fkey"
            columns: ["source_entity_id"]
            isOneToOne: false
            referencedRelation: "knowledge_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_relationships_target_entity_id_fkey"
            columns: ["target_entity_id"]
            isOneToOne: false
            referencedRelation: "knowledge_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      faucet_claims: {
        Row: {
          amount: number
          claimed_at: string
          created_at: string
          device_id: string | null
          error_message: string | null
          id: string
          ip_address: unknown | null
          session_key: string | null
          status: string
          transaction_hash: string | null
          updated_at: string
          wallet_address: string
        }
        Insert: {
          amount: number
          claimed_at?: string
          created_at?: string
          device_id?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          session_key?: string | null
          status?: string
          transaction_hash?: string | null
          updated_at?: string
          wallet_address: string
        }
        Update: {
          amount?: number
          claimed_at?: string
          created_at?: string
          device_id?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          session_key?: string | null
          status?: string
          transaction_hash?: string | null
          updated_at?: string
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "faucet_claims_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "active_devices_view"
            referencedColumns: ["device_id"]
          },
          {
            foreignKeyName: "faucet_claims_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      faucet_config: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      frontend_events: {
        Row: {
          created_at: string
          device_id: string | null
          event_category: string | null
          event_data: Json
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          occurred_at: string
          page_path: string | null
          processed: boolean | null
          requires_action: boolean | null
          session_id: string | null
          source: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          event_category?: string | null
          event_data?: Json
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          occurred_at?: string
          page_path?: string | null
          processed?: boolean | null
          requires_action?: boolean | null
          session_id?: string | null
          source?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_id?: string | null
          event_category?: string | null
          event_data?: Json
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          occurred_at?: string
          page_path?: string | null
          processed?: boolean | null
          requires_action?: boolean | null
          session_id?: string | null
          source?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      frontend_health_checks: {
        Row: {
          check_timestamp: string
          created_at: string
          error_message: string | null
          id: string
          metadata: Json | null
          response_time_ms: number | null
          status: string
          status_code: number | null
        }
        Insert: {
          check_timestamp?: string
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          response_time_ms?: number | null
          status: string
          status_code?: number | null
        }
        Update: {
          check_timestamp?: string
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          response_time_ms?: number | null
          status?: string
          status_code?: number | null
        }
        Relationships: []
      }
      interaction_patterns: {
        Row: {
          confidence_score: number | null
          frequency: number | null
          id: string
          last_occurrence: string
          metadata: Json | null
          pattern_data: Json
          pattern_name: string
          session_key: string
        }
        Insert: {
          confidence_score?: number | null
          frequency?: number | null
          id?: string
          last_occurrence?: string
          metadata?: Json | null
          pattern_data: Json
          pattern_name: string
          session_key: string
        }
        Update: {
          confidence_score?: number | null
          frequency?: number | null
          id?: string
          last_occurrence?: string
          metadata?: Json | null
          pattern_data?: Json
          pattern_name?: string
          session_key?: string
        }
        Relationships: []
      }
      ip_address_log: {
        Row: {
          activity_type: string | null
          created_at: string
          device_id: string | null
          first_seen: string
          geolocation: Json | null
          id: string
          ip_address: unknown
          last_seen: string
          metadata: Json | null
          session_key: string | null
          total_requests: number | null
          user_agent: string | null
          wallet_address: string | null
          worker_id: string | null
        }
        Insert: {
          activity_type?: string | null
          created_at?: string
          device_id?: string | null
          first_seen?: string
          geolocation?: Json | null
          id?: string
          ip_address: unknown
          last_seen?: string
          metadata?: Json | null
          session_key?: string | null
          total_requests?: number | null
          user_agent?: string | null
          wallet_address?: string | null
          worker_id?: string | null
        }
        Update: {
          activity_type?: string | null
          created_at?: string
          device_id?: string | null
          first_seen?: string
          geolocation?: Json | null
          id?: string
          ip_address?: unknown
          last_seen?: string
          metadata?: Json | null
          session_key?: string | null
          total_requests?: number | null
          user_agent?: string | null
          wallet_address?: string | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ip_address_log_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "active_devices_view"
            referencedColumns: ["device_id"]
          },
          {
            foreignKeyName: "ip_address_log_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_entities: {
        Row: {
          confidence_score: number | null
          created_at: string
          description: string | null
          entity_name: string
          entity_type: string
          id: string
          metadata: Json | null
          updated_at: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          description?: string | null
          entity_name: string
          entity_type: string
          id?: string
          metadata?: Json | null
          updated_at?: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          description?: string | null
          entity_name?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      learning_patterns: {
        Row: {
          confidence_score: number | null
          id: string
          last_used: string | null
          pattern_data: Json | null
          pattern_type: string
          usage_count: number | null
        }
        Insert: {
          confidence_score?: number | null
          id?: string
          last_used?: string | null
          pattern_data?: Json | null
          pattern_type: string
          usage_count?: number | null
        }
        Update: {
          confidence_score?: number | null
          id?: string
          last_used?: string | null
          pattern_data?: Json | null
          pattern_type?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      learning_sessions: {
        Row: {
          agent_id: string
          completed_at: string | null
          id: string
          learning_materials: Json
          learning_task_id: string | null
          metadata: Json | null
          proficiency_tests: Json | null
          progress_percentage: number
          skill_being_learned: string
          started_at: string
          status: string
        }
        Insert: {
          agent_id: string
          completed_at?: string | null
          id?: string
          learning_materials: Json
          learning_task_id?: string | null
          metadata?: Json | null
          proficiency_tests?: Json | null
          progress_percentage?: number
          skill_being_learned: string
          started_at?: string
          status?: string
        }
        Update: {
          agent_id?: string
          completed_at?: string | null
          id?: string
          learning_materials?: Json
          learning_task_id?: string | null
          metadata?: Json | null
          proficiency_tests?: Json | null
          progress_percentage?: number
          skill_being_learned?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_sessions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      manus_token_usage: {
        Row: {
          created_at: string
          date: string
          id: string
          last_reset_at: string
          tokens_available: number
          tokens_used: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          last_reset_at?: string
          tokens_available?: number
          tokens_used?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          last_reset_at?: string
          tokens_available?: number
          tokens_used?: number
          updated_at?: string
        }
        Relationships: []
      }
      memory_contexts: {
        Row: {
          content: string
          context_type: string
          embedding: number[] | null
          id: string
          importance_score: number | null
          metadata: Json | null
          session_id: string
          timestamp: string | null
          user_id: string
        }
        Insert: {
          content: string
          context_type: string
          embedding?: number[] | null
          id?: string
          importance_score?: number | null
          metadata?: Json | null
          session_id: string
          timestamp?: string | null
          user_id: string
        }
        Update: {
          content?: string
          context_type?: string
          embedding?: number[] | null
          id?: string
          importance_score?: number | null
          metadata?: Json | null
          session_id?: string
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      nlg_generated_content: {
        Row: {
          audience_type: string
          content: string
          content_type: string
          created_at: string | null
          engagement_metrics: Json | null
          format: string | null
          id: string
          metadata: Json | null
          published: boolean | null
          published_at: string | null
          published_to: string[] | null
          source_data: Json | null
          title: string | null
        }
        Insert: {
          audience_type: string
          content: string
          content_type: string
          created_at?: string | null
          engagement_metrics?: Json | null
          format?: string | null
          id?: string
          metadata?: Json | null
          published?: boolean | null
          published_at?: string | null
          published_to?: string[] | null
          source_data?: Json | null
          title?: string | null
        }
        Update: {
          audience_type?: string
          content?: string
          content_type?: string
          created_at?: string | null
          engagement_metrics?: Json | null
          format?: string | null
          id?: string
          metadata?: Json | null
          published?: boolean | null
          published_at?: string | null
          published_to?: string[] | null
          source_data?: Json | null
          title?: string | null
        }
        Relationships: []
      }
      pop_events_ledger: {
        Row: {
          activity_log_ids: string[] | null
          confidence_score: number | null
          created_at: string | null
          device_id: string
          event_data: Json | null
          event_description: string
          event_timestamp: string
          event_type: Database["public"]["Enums"]["pop_event_type"]
          id: string
          is_paid_out: boolean | null
          is_validated: boolean | null
          metadata: Json | null
          paid_out_at: string | null
          pop_points: number
          session_id: string | null
          transaction_hash: string | null
          user_id: string | null
          validated_at: string
          validation_method: string | null
          wallet_address: string
        }
        Insert: {
          activity_log_ids?: string[] | null
          confidence_score?: number | null
          created_at?: string | null
          device_id: string
          event_data?: Json | null
          event_description: string
          event_timestamp?: string
          event_type: Database["public"]["Enums"]["pop_event_type"]
          id?: string
          is_paid_out?: boolean | null
          is_validated?: boolean | null
          metadata?: Json | null
          paid_out_at?: string | null
          pop_points: number
          session_id?: string | null
          transaction_hash?: string | null
          user_id?: string | null
          validated_at?: string
          validation_method?: string | null
          wallet_address: string
        }
        Update: {
          activity_log_ids?: string[] | null
          confidence_score?: number | null
          created_at?: string | null
          device_id?: string
          event_data?: Json | null
          event_description?: string
          event_timestamp?: string
          event_type?: Database["public"]["Enums"]["pop_event_type"]
          id?: string
          is_paid_out?: boolean | null
          is_validated?: boolean | null
          metadata?: Json | null
          paid_out_at?: string | null
          pop_points?: number
          session_id?: string | null
          transaction_hash?: string | null
          user_id?: string | null
          validated_at?: string
          validation_method?: string | null
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "pop_events_ledger_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "active_devices_view"
            referencedColumns: ["device_id"]
          },
          {
            foreignKeyName: "pop_events_ledger_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pop_events_ledger_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "active_devices_view"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "pop_events_ledger_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "device_connection_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      predictive_insights: {
        Row: {
          analysis_type: string
          confidence_score: number | null
          created_at: string | null
          data_source: string
          forecast_horizon: string | null
          id: string
          insight_data: Json
          metadata: Json | null
          resolved_at: string | null
          severity: string | null
          status: string | null
        }
        Insert: {
          analysis_type: string
          confidence_score?: number | null
          created_at?: string | null
          data_source: string
          forecast_horizon?: string | null
          id?: string
          insight_data: Json
          metadata?: Json | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
        }
        Update: {
          analysis_type?: string
          confidence_score?: number | null
          created_at?: string | null
          data_source?: string
          forecast_horizon?: string | null
          id?: string
          insight_data?: Json
          metadata?: Json | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          identifier: string
          request_count: number | null
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          identifier: string
          request_count?: number | null
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          identifier?: string
          request_count?: number | null
          window_start?: string
        }
        Relationships: []
      }
      repos: {
        Row: {
          category: string
          default_branch: string | null
          is_fork: boolean | null
          last_checked: string | null
          name: string
          repo_exists: boolean | null
          url: string | null
        }
        Insert: {
          category: string
          default_branch?: string | null
          is_fork?: boolean | null
          last_checked?: string | null
          name: string
          repo_exists?: boolean | null
          url?: string | null
        }
        Update: {
          category?: string
          default_branch?: string | null
          is_fork?: boolean | null
          last_checked?: string | null
          name?: string
          repo_exists?: boolean | null
          url?: string | null
        }
        Relationships: []
      }
      scenario_simulations: {
        Row: {
          confidence_level: number | null
          created_at: string | null
          created_by: string | null
          execution_time_ms: number | null
          id: string
          input_parameters: Json
          metadata: Json | null
          recommendations: string[] | null
          risk_assessment: Json | null
          scenario_name: string
          scenario_type: string
          simulation_results: Json
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string | null
          created_by?: string | null
          execution_time_ms?: number | null
          id?: string
          input_parameters: Json
          metadata?: Json | null
          recommendations?: string[] | null
          risk_assessment?: Json | null
          scenario_name: string
          scenario_type: string
          simulation_results: Json
        }
        Update: {
          confidence_level?: number | null
          created_at?: string | null
          created_by?: string | null
          execution_time_ms?: number | null
          id?: string
          input_parameters?: Json
          metadata?: Json | null
          recommendations?: string[] | null
          risk_assessment?: Json | null
          scenario_name?: string
          scenario_type?: string
          simulation_results?: Json
        }
        Relationships: []
      }
      scheduled_actions: {
        Row: {
          action_data: Json
          action_name: string
          action_type: string
          created_at: string
          id: string
          is_active: boolean | null
          last_execution: string | null
          metadata: Json | null
          next_execution: string | null
          schedule_expression: string
          session_key: string
        }
        Insert: {
          action_data: Json
          action_name: string
          action_type: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_execution?: string | null
          metadata?: Json | null
          next_execution?: string | null
          schedule_expression: string
          session_key: string
        }
        Update: {
          action_data?: Json
          action_name?: string
          action_type?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_execution?: string | null
          metadata?: Json | null
          next_execution?: string | null
          schedule_expression?: string
          session_key?: string
        }
        Relationships: []
      }
      skill_gap_analysis: {
        Row: {
          blocked_tasks: string[]
          created_at: string
          frequency: number
          id: string
          identified_skill: string
          metadata: Json | null
          priority: number
          proposed_learning_tasks: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          blocked_tasks: string[]
          created_at?: string
          frequency?: number
          id?: string
          identified_skill: string
          metadata?: Json | null
          priority?: number
          proposed_learning_tasks?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          blocked_tasks?: string[]
          created_at?: string
          frequency?: number
          id?: string
          identified_skill?: string
          metadata?: Json | null
          priority?: number
          proposed_learning_tasks?: string[] | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          created_at: string
          details: Json | null
          error_stack: string | null
          id: string
          log_category: string
          log_level: string
          log_source: string
          message: string
          metadata: Json | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          user_context: Json | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          error_stack?: string | null
          id?: string
          log_category: string
          log_level: string
          log_source: string
          message: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          user_context?: Json | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          error_stack?: string | null
          id?: string
          log_category?: string
          log_level?: string
          log_source?: string
          message?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          user_context?: Json | null
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          created_at: string
          id: string
          measured_at: string
          metadata: Json | null
          metric_category: string
          metric_name: string
          metric_value: number
        }
        Insert: {
          created_at?: string
          id?: string
          measured_at?: string
          metadata?: Json | null
          metric_category: string
          metric_name: string
          metric_value: number
        }
        Update: {
          created_at?: string
          id?: string
          measured_at?: string
          metadata?: Json | null
          metric_category?: string
          metric_name?: string
          metric_value?: number
        }
        Relationships: []
      }
      system_performance_logs: {
        Row: {
          agent_stats: Json
          api_health_stats: Json
          conversation_stats: Json
          created_at: string
          health_score: number
          health_status: string
          id: string
          issues_detected: Json[] | null
          learning_stats: Json
          metadata: Json | null
          python_execution_stats: Json
          recommendations: string[] | null
          recorded_at: string
          skill_gap_stats: Json
          snapshot_type: string
          task_stats: Json
          workflow_stats: Json
        }
        Insert: {
          agent_stats?: Json
          api_health_stats?: Json
          conversation_stats?: Json
          created_at?: string
          health_score: number
          health_status: string
          id?: string
          issues_detected?: Json[] | null
          learning_stats?: Json
          metadata?: Json | null
          python_execution_stats?: Json
          recommendations?: string[] | null
          recorded_at?: string
          skill_gap_stats?: Json
          snapshot_type: string
          task_stats?: Json
          workflow_stats?: Json
        }
        Update: {
          agent_stats?: Json
          api_health_stats?: Json
          conversation_stats?: Json
          created_at?: string
          health_score?: number
          health_status?: string
          id?: string
          issues_detected?: Json[] | null
          learning_stats?: Json
          metadata?: Json | null
          python_execution_stats?: Json
          recommendations?: string[] | null
          recorded_at?: string
          skill_gap_stats?: Json
          snapshot_type?: string
          task_stats?: Json
          workflow_stats?: Json
        }
        Relationships: []
      }
      task_executions: {
        Row: {
          error_message: string | null
          execution_end: string | null
          execution_start: string
          id: string
          metadata: Json | null
          result_data: Json | null
          status: string
          task_id: string
        }
        Insert: {
          error_message?: string | null
          execution_end?: string | null
          execution_start?: string
          id?: string
          metadata?: Json | null
          result_data?: Json | null
          status?: string
          task_id: string
        }
        Update: {
          error_message?: string | null
          execution_end?: string | null
          execution_start?: string
          id?: string
          metadata?: Json | null
          result_data?: Json | null
          status?: string
          task_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee_agent_id: string | null
          blocking_reason: string | null
          category: string
          created_at: string
          description: string
          id: string
          priority: number
          repo: string
          stage: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee_agent_id?: string | null
          blocking_reason?: string | null
          category: string
          created_at?: string
          description: string
          id: string
          priority?: number
          repo: string
          stage: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee_agent_id?: string | null
          blocking_reason?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          priority?: number
          repo?: string
          stage?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_agent_id_fkey"
            columns: ["assignee_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          preference_key: string
          preference_value: Json
          session_key: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          preference_key: string
          preference_value: Json
          session_key: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          preference_key?: string
          preference_value?: Json
          session_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_worker_mappings: {
        Row: {
          alias: string | null
          created_at: string
          device_id: string | null
          id: string
          ip_addresses: Json | null
          is_active: boolean
          last_active: string
          metadata: Json | null
          registered_at: string
          session_key: string | null
          total_hashrate: number | null
          total_shares: number | null
          updated_at: string
          user_id: string | null
          wallet_address: string
          worker_id: string
        }
        Insert: {
          alias?: string | null
          created_at?: string
          device_id?: string | null
          id?: string
          ip_addresses?: Json | null
          is_active?: boolean
          last_active?: string
          metadata?: Json | null
          registered_at?: string
          session_key?: string | null
          total_hashrate?: number | null
          total_shares?: number | null
          updated_at?: string
          user_id?: string | null
          wallet_address: string
          worker_id: string
        }
        Update: {
          alias?: string | null
          created_at?: string
          device_id?: string | null
          id?: string
          ip_addresses?: Json | null
          is_active?: boolean
          last_active?: string
          metadata?: Json | null
          registered_at?: string
          session_key?: string | null
          total_hashrate?: number | null
          total_shares?: number | null
          updated_at?: string
          user_id?: string | null
          wallet_address?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_worker_mappings_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "active_devices_view"
            referencedColumns: ["device_id"]
          },
          {
            foreignKeyName: "user_worker_mappings_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      vercel_deployments: {
        Row: {
          build_duration_ms: number | null
          created_at: string
          deployed_at: string | null
          deployment_id: string | null
          deployment_url: string | null
          git_branch: string | null
          git_commit_message: string | null
          git_commit_sha: string | null
          id: string
          metadata: Json | null
          notified_backend: boolean | null
          project_id: string
          status: string
          trigger_source: string | null
          updated_at: string
        }
        Insert: {
          build_duration_ms?: number | null
          created_at?: string
          deployed_at?: string | null
          deployment_id?: string | null
          deployment_url?: string | null
          git_branch?: string | null
          git_commit_message?: string | null
          git_commit_sha?: string | null
          id?: string
          metadata?: Json | null
          notified_backend?: boolean | null
          project_id?: string
          status: string
          trigger_source?: string | null
          updated_at?: string
        }
        Update: {
          build_duration_ms?: number | null
          created_at?: string
          deployed_at?: string | null
          deployment_id?: string | null
          deployment_url?: string | null
          git_branch?: string | null
          git_commit_message?: string | null
          git_commit_sha?: string | null
          id?: string
          metadata?: Json | null
          notified_backend?: boolean | null
          project_id?: string
          status?: string
          trigger_source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      vercel_function_logs: {
        Row: {
          cold_start: boolean | null
          created_at: string
          error_message: string | null
          execution_time_ms: number | null
          function_name: string
          function_path: string | null
          id: string
          invocation_id: string | null
          invoked_at: string
          logs: string[] | null
          metadata: Json | null
          region: string | null
          request_method: string | null
          request_path: string | null
          response_status: number | null
          status: string
        }
        Insert: {
          cold_start?: boolean | null
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          function_name: string
          function_path?: string | null
          id?: string
          invocation_id?: string | null
          invoked_at?: string
          logs?: string[] | null
          metadata?: Json | null
          region?: string | null
          request_method?: string | null
          request_path?: string | null
          response_status?: number | null
          status: string
        }
        Update: {
          cold_start?: boolean | null
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          function_name?: string
          function_path?: string | null
          id?: string
          invocation_id?: string | null
          invoked_at?: string
          logs?: string[] | null
          metadata?: Json | null
          region?: string | null
          request_method?: string | null
          request_path?: string | null
          response_status?: number | null
          status?: string
        }
        Relationships: []
      }
      webhook_configs: {
        Row: {
          created_at: string | null
          endpoint_url: string
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          secret_key: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint_url: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          secret_key?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint_url?: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          secret_key?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          payload: Json | null
          response: Json | null
          status: string | null
          trigger_operation: string
          trigger_table: string
          webhook_name: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          payload?: Json | null
          response?: Json | null
          status?: string | null
          trigger_operation: string
          trigger_table: string
          webhook_name: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          payload?: Json | null
          response?: Json | null
          status?: string | null
          trigger_operation?: string
          trigger_table?: string
          webhook_name?: string
        }
        Relationships: []
      }
      worker_registrations: {
        Row: {
          battery_optimized: boolean | null
          charging_status: string | null
          created_at: string
          device_id: string | null
          id: string
          ip_address: unknown
          is_active: boolean
          last_battery_level: number | null
          last_seen: string
          metadata: Json | null
          registration_date: string
          session_key: string | null
          updated_at: string
          worker_id: string
        }
        Insert: {
          battery_optimized?: boolean | null
          charging_status?: string | null
          created_at?: string
          device_id?: string | null
          id?: string
          ip_address: unknown
          is_active?: boolean
          last_battery_level?: number | null
          last_seen?: string
          metadata?: Json | null
          registration_date?: string
          session_key?: string | null
          updated_at?: string
          worker_id: string
        }
        Update: {
          battery_optimized?: boolean | null
          charging_status?: string | null
          created_at?: string
          device_id?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean
          last_battery_level?: number | null
          last_seen?: string
          metadata?: Json | null
          registration_date?: string
          session_key?: string | null
          updated_at?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worker_registrations_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "active_devices_view"
            referencedColumns: ["device_id"]
          },
          {
            foreignKeyName: "worker_registrations_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_executions: {
        Row: {
          created_at: string
          current_step_index: number
          description: string | null
          end_time: string | null
          failed_step: string | null
          final_result: Json | null
          id: string
          metadata: Json | null
          name: string
          start_time: string
          status: string
          total_steps: number
          updated_at: string
          workflow_id: string
        }
        Insert: {
          created_at?: string
          current_step_index?: number
          description?: string | null
          end_time?: string | null
          failed_step?: string | null
          final_result?: Json | null
          id?: string
          metadata?: Json | null
          name: string
          start_time?: string
          status?: string
          total_steps: number
          updated_at?: string
          workflow_id: string
        }
        Update: {
          created_at?: string
          current_step_index?: number
          description?: string | null
          end_time?: string | null
          failed_step?: string | null
          final_result?: Json | null
          id?: string
          metadata?: Json | null
          name?: string
          start_time?: string
          status?: string
          total_steps?: number
          updated_at?: string
          workflow_id?: string
        }
        Relationships: []
      }
      workflow_steps: {
        Row: {
          created_at: string
          description: string | null
          duration_ms: number | null
          end_time: string | null
          error: string | null
          id: string
          metadata: Json | null
          name: string
          result: Json | null
          start_time: string | null
          status: string
          step_id: string
          step_index: number
          step_type: string
          updated_at: string
          workflow_execution_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_ms?: number | null
          end_time?: string | null
          error?: string | null
          id?: string
          metadata?: Json | null
          name: string
          result?: Json | null
          start_time?: string | null
          status?: string
          step_id: string
          step_index: number
          step_type: string
          updated_at?: string
          workflow_execution_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_ms?: number | null
          end_time?: string | null
          error?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          result?: Json | null
          start_time?: string | null
          status?: string
          step_id?: string
          step_index?: number
          step_type?: string
          updated_at?: string
          workflow_execution_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_steps_workflow_execution_id_fkey"
            columns: ["workflow_execution_id"]
            isOneToOne: false
            referencedRelation: "workflow_executions"
            referencedColumns: ["id"]
          },
        ]
      }
      workload_forecasts: {
        Row: {
          confidence_score: number
          contributing_factors: Json
          forecast_at: string
          forecast_type: string
          forecast_window: string
          id: string
          metadata: Json | null
          predicted_value: number
          recommended_actions: string[] | null
        }
        Insert: {
          confidence_score?: number
          contributing_factors: Json
          forecast_at?: string
          forecast_type: string
          forecast_window: string
          id?: string
          metadata?: Json | null
          predicted_value: number
          recommended_actions?: string[] | null
        }
        Update: {
          confidence_score?: number
          contributing_factors?: Json
          forecast_at?: string
          forecast_type?: string
          forecast_window?: string
          id?: string
          metadata?: Json | null
          predicted_value?: number
          recommended_actions?: string[] | null
        }
        Relationships: []
      }
      xmrt_assistant_interactions: {
        Row: {
          created_at: string
          device_id: string | null
          id: string
          interaction_type: string | null
          metadata: Json | null
          prompt: string | null
          recommendations_given: Json | null
          response: string | null
          session_id: string | null
          user_action_taken: string | null
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          id?: string
          interaction_type?: string | null
          metadata?: Json | null
          prompt?: string | null
          recommendations_given?: Json | null
          response?: string | null
          session_id?: string | null
          user_action_taken?: string | null
        }
        Update: {
          created_at?: string
          device_id?: string | null
          id?: string
          interaction_type?: string | null
          metadata?: Json | null
          prompt?: string | null
          recommendations_given?: Json | null
          response?: string | null
          session_id?: string | null
          user_action_taken?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "xmrt_assistant_interactions_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "active_devices_view"
            referencedColumns: ["device_id"]
          },
          {
            foreignKeyName: "xmrt_assistant_interactions_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "xmrt_assistant_interactions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "battery_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      active_devices_view: {
        Row: {
          battery_level_start: number | null
          charging_sessions_count: number | null
          connected_at: string | null
          connection_duration_seconds: number | null
          device_fingerprint: string | null
          device_id: string | null
          device_type: string | null
          last_heartbeat: string | null
          session_id: string | null
          wallet_address: string | null
          worker_id: string | null
        }
        Relationships: []
      }
      eliza_gatekeeper_stats: {
        Row: {
          avg_duration_ms: number | null
          failed_calls: number | null
          last_call_at: string | null
          source: string | null
          successful_calls: number | null
          target: string | null
          total_calls: number | null
        }
        Relationships: []
      }
      eliza_python_executions_all: {
        Row: {
          code: string | null
          created_at: string | null
          error: string | null
          execution_time_ms: number | null
          exit_code: number | null
          id: string | null
          output: string | null
          purpose: string | null
          source: string | null
        }
        Relationships: []
      }
      pop_leaderboard_view: {
        Row: {
          avg_confidence: number | null
          devices_count: number | null
          last_activity: string | null
          total_events: number | null
          total_pop_points: number | null
          wallet_address: string | null
        }
        Relationships: []
      }
      recent_conversation_messages: {
        Row: {
          content: string | null
          id: string | null
          message_type: string | null
          metadata: Json | null
          processing_data: Json | null
          session_id: string | null
          timestamp: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      system_health_summary: {
        Row: {
          active_sessions: number | null
          checked_at: string | null
          database_size: string | null
          frontend_uptime_checks: number | null
          messages_last_hour: number | null
          recent_function_errors: number | null
        }
        Relationships: []
      }
      v_agent_python_failures: {
        Row: {
          common_purposes: Json | null
          failed_count: number | null
          last_failure: string | null
          source: string | null
          success_count: number | null
          success_rate_percent: number | null
        }
        Relationships: []
      }
      v_critical_incidents: {
        Row: {
          duration_minutes: number | null
          health_score: number | null
          health_status: string | null
          id: string | null
          issues_detected: Json[] | null
          recommendations: string[] | null
          recorded_at: string | null
        }
        Relationships: []
      }
      v_health_history_daily: {
        Row: {
          avg_health_score: number | null
          checks_performed: number | null
          critical_count: number | null
          date: string | null
          degraded_count: number | null
          healthy_count: number | null
          max_health_score: number | null
          min_health_score: number | null
          warning_count: number | null
        }
        Relationships: []
      }
      v_performance_trends_24h: {
        Row: {
          avg_health_score: number | null
          hour: string | null
          max_health_score: number | null
          min_health_score: number | null
          most_common_status: string | null
          snapshot_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      batch_vectorize_memories: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      calculate_charging_pop_points: {
        Args: {
          p_battery_contribution?: number
          p_duration_minutes: number
          p_efficiency: number
        }
        Returns: number
      }
      check_session_ownership: {
        Args: { request_metadata: Json; session_uuid: string }
        Returns: boolean
      }
      disconnect_device_session: {
        Args: { p_session_id: string }
        Returns: undefined
      }
      generate_conversation_insights: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      increment_rate_limit: {
        Args: { p_endpoint: string; p_identifier: string }
        Returns: undefined
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_knowledge_entities: {
        Args: { match_count?: number; search_query: string }
        Returns: {
          confidence_score: number
          description: string
          entity_name: string
          entity_type: string
          id: string
          metadata: Json
        }[]
      }
      match_memories: {
        Args: {
          match_count: number
          match_threshold: number
          query_embedding: string
          user_id_filter: string
        }
        Returns: {
          content: string
          context_type: string
          embedding: string
          id: string
          importance_score: number
          metadata: Json
          session_id: string
          similarity: number
          ts: string
          user_id: string
        }[]
      }
      reset_manus_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      update_session_heartbeat: {
        Args: { p_session_id: string }
        Returns: undefined
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      activity_category:
        | "connection"
        | "charging"
        | "calibration"
        | "battery_health"
        | "system_event"
        | "user_action"
        | "anomaly"
      activity_severity: "info" | "warning" | "error" | "critical"
      command_status:
        | "pending"
        | "sent"
        | "acknowledged"
        | "executed"
        | "failed"
        | "expired"
      command_type:
        | "adjust_charging_mode"
        | "collect_thermal_data"
        | "adjust_calibration_frequency"
        | "enable_battery_health_mode"
        | "send_notification"
        | "request_diagnostic_report"
        | "update_configuration"
      pop_event_type:
        | "charging_session_completed"
        | "calibration_performed"
        | "battery_health_contribution"
        | "thermal_data_collection"
        | "sustained_connection"
        | "diagnostic_report_submitted"
        | "optimization_applied"
        | "community_contribution"
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
      activity_category: [
        "connection",
        "charging",
        "calibration",
        "battery_health",
        "system_event",
        "user_action",
        "anomaly",
      ],
      activity_severity: ["info", "warning", "error", "critical"],
      command_status: [
        "pending",
        "sent",
        "acknowledged",
        "executed",
        "failed",
        "expired",
      ],
      command_type: [
        "adjust_charging_mode",
        "collect_thermal_data",
        "adjust_calibration_frequency",
        "enable_battery_health_mode",
        "send_notification",
        "request_diagnostic_report",
        "update_configuration",
      ],
      pop_event_type: [
        "charging_session_completed",
        "calibration_performed",
        "battery_health_contribution",
        "thermal_data_collection",
        "sustained_connection",
        "diagnostic_report_submitted",
        "optimization_applied",
        "community_contribution",
      ],
    },
  },
} as const
