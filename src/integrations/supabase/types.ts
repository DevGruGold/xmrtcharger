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
      chat_messages: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: string
          message_text: string
          sender: string
          session_id: string
          timestamp: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          message_text: string
          sender: string
          session_id: string
          timestamp?: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          message_text?: string
          sender?: string
          session_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
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
          error_message: string | null
          id: string
          ip_address: unknown | null
          status: string
          transaction_hash: string | null
          updated_at: string
          wallet_address: string
        }
        Insert: {
          amount: number
          claimed_at?: string
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          status?: string
          transaction_hash?: string | null
          updated_at?: string
          wallet_address: string
        }
        Update: {
          amount?: number
          claimed_at?: string
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          status?: string
          transaction_hash?: string | null
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
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
          id: string
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
          id?: string
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
          id?: string
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
          created_at: string
          id: string
          ip_address: unknown
          is_active: boolean
          last_seen: string
          metadata: Json | null
          registration_date: string
          session_key: string | null
          updated_at: string
          worker_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address: unknown
          is_active?: boolean
          last_seen?: string
          metadata?: Json | null
          registration_date?: string
          session_key?: string | null
          updated_at?: string
          worker_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown
          is_active?: boolean
          last_seen?: string
          metadata?: Json | null
          registration_date?: string
          session_key?: string | null
          updated_at?: string
          worker_id?: string
        }
        Relationships: []
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
    }
    Views: {
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
      check_session_ownership: {
        Args: { request_metadata: Json; session_uuid: string }
        Returns: boolean
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
