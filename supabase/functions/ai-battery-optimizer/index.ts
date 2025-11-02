import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OptimizationRequest {
  deviceId: string;
  sessionId?: string;
  batteryStatus: {
    level: number;
    charging: boolean;
    chargingSpeed?: string;
    temperatureImpact?: string;
  };
  context?: 'real-time' | 'health-check' | 'diagnostics';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const requestData: OptimizationRequest = await req.json();
    console.log('🤖 AI Optimization Request:', requestData);

    // Fetch recent battery history
    const { data: recentReadings } = await supabaseClient
      .from('battery_readings')
      .select('*')
      .eq('device_id', requestData.deviceId)
      .order('timestamp', { ascending: false })
      .limit(20);

    // Fetch charging sessions
    const { data: chargingSessions } = await supabaseClient
      .from('charging_sessions')
      .select('*')
      .eq('device_id', requestData.deviceId)
      .order('started_at', { ascending: false })
      .limit(10);

    // Fetch recent activity
    const { data: recentActivity } = await supabaseClient
      .from('device_activity_log')
      .select('*')
      .eq('device_id', requestData.deviceId)
      .order('occurred_at', { ascending: false })
      .limit(15);

    // Build context for AI
    const systemPrompt = `You are an advanced battery optimization AI assistant specialized in analyzing device battery health and performance. 

Your role is to:
1. Analyze battery readings, charging patterns, and device activity
2. Identify optimization opportunities and potential issues
3. Provide actionable, specific recommendations
4. Estimate the impact of each recommendation
5. Prioritize recommendations by urgency and impact

Always respond with practical, implementable advice. Be concise but thorough.`;

    const userPrompt = `Analyze this battery data and provide optimization recommendations:

**Current Status:**
- Battery Level: ${requestData.batteryStatus.level}%
- Charging: ${requestData.batteryStatus.charging ? 'Yes' : 'No'}
- Charging Speed: ${requestData.batteryStatus.chargingSpeed || 'N/A'}
- Temperature Impact: ${requestData.batteryStatus.temperatureImpact || 'N/A'}
- Context: ${requestData.context || 'general'}

**Recent Battery Readings (last 20):**
${JSON.stringify(recentReadings?.slice(0, 5) || [], null, 2)}

**Charging Session History (last 10):**
${JSON.stringify(chargingSessions?.slice(0, 3) || [], null, 2)}

**Recent Device Activity:**
${JSON.stringify(recentActivity?.slice(0, 5) || [], null, 2)}

Provide:
1. **Overall Health Score** (0-100)
2. **Immediate Actions** (what to do right now)
3. **Short-term Optimizations** (next 24 hours)
4. **Long-term Recommendations** (ongoing practices)
5. **Risk Assessment** (any concerning patterns)

Format your response as JSON with this structure:
{
  "healthScore": number,
  "status": "excellent" | "good" | "fair" | "poor",
  "immediateActions": [{ "action": string, "impact": "high" | "medium" | "low", "reason": string }],
  "shortTermOptimizations": [{ "action": string, "timeframe": string, "expectedImprovement": string }],
  "longTermRecommendations": [{ "action": string, "benefit": string }],
  "riskAssessment": { "level": "low" | "medium" | "high", "concerns": string[] },
  "insights": string
}`;

    // Call Lovable AI Gateway for intelligent analysis
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1500,
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI Gateway Error:', aiResponse.status, errorText);
      
      // Handle specific error codes
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded. Please wait a moment and try again.',
            retryable: true 
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: 'AI credits exhausted. Please add credits to your Lovable workspace.',
            retryable: false 
          }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Lovable AI Gateway failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    console.log('🤖 AI Response:', aiContent);

    // Parse AI response (should be JSON due to response_format)
    let optimization;
    try {
      optimization = JSON.parse(aiContent);
    } catch (parseError) {
      console.warn('Failed to parse AI response as JSON, creating structured fallback:', parseError);
      optimization = {
        healthScore: 75,
        status: 'good',
        immediateActions: [{ action: 'Continue monitoring', impact: 'medium', reason: 'AI analysis in progress' }],
        shortTermOptimizations: [],
        longTermRecommendations: [],
        riskAssessment: { level: 'low', concerns: [] },
        insights: aiContent.substring(0, 500)
      };
    }

    // Store optimization result
    await supabaseClient
      .from('device_activity_log')
      .insert({
        device_id: requestData.deviceId,
        session_id: requestData.sessionId,
        activity_type: 'ai_optimization',
        category: 'system_event',
        severity: 'info',
        description: `AI analyzed battery health: ${optimization.status}`,
        details: {
          health_score: optimization.healthScore,
          optimization_data: optimization,
          readings_analyzed: recentReadings?.length || 0,
          sessions_analyzed: chargingSessions?.length || 0,
        },
      });

    console.log('✅ AI Optimization Complete:', optimization.healthScore);

    return new Response(
      JSON.stringify({ 
        success: true,
        optimization,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ AI Optimizer Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});