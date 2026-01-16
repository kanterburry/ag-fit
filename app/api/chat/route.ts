import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    try {
        const supabase = await createClient();
        const today = new Date();
        const startOfHistory = new Date();
        startOfHistory.setDate(today.getDate() - 90);

        const startOfGarmin = new Date();
        startOfGarmin.setDate(today.getDate() - 30);

        // Get user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        // TEMPORARY DEV BYPASS: Allow testing without auth
        if (authError || !user) {
            console.warn('ProtocolAI: No authenticated user, using fallback USER_ID for dev testing');
            // TODO: Remove this bypass before production deployment
            const fallbackUserId = process.env.USER_ID;
            if (!fallbackUserId) {
                console.error('ProtocolAI: No USER_ID in env for fallback');
                return new Response("Unauthorized - No fallback user ID", { status: 401 });
            }
            // Continue with fallback user ID (see line 38 update below)
        }

        // 1. Fetch user's active and recent protocols
        // Use authenticated user ID or fallback for dev testing
        const userId = user?.id || process.env.USER_ID;

        let protocols: any[] = [];
        try {
            const { data, error } = await supabase
                .from('protocols')
                .select(`
                    *,
                    protocol_phases (*),
                    daily_logs (*)
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            if (!error) protocols = data || [];
            else console.error('ProtocolAI: Error fetching protocols', error);
        } catch (e) { console.error('ProtocolAI: Exception fetching protocols', e); }

        // 2. Fetch recent health metrics
        let garminStats: any[] = [];
        try {
            const { data, error } = await supabase
                .from('garmin_daily_metrics')
                .select('date, resting_hr, sleep_score, stress_avg, body_battery_max, body_battery_min, steps, calories_active')
                .gte('date', startOfGarmin.toISOString().split('T')[0])
                .order('date', { ascending: false });
            if (!error) garminStats = data || [];
            else console.error('ProtocolAI: Error fetching garmin stats', error);
        } catch (e) { console.error('ProtocolAI: Exception fetching garmin stats', e); }

        // 3. Fetch training metrics
        let trainingStatus: any[] = [];
        try {
            const { data, error } = await supabase
                .from('garmin_training_status')
                .select('*')
                .order('date', { ascending: false })
                .limit(30);
            if (!error) trainingStatus = data || [];
            else console.error('ProtocolAI: Error fetching training status', error);
        } catch (e) { console.error('ProtocolAI: Exception fetching training status', e); }

        // 4. Fetch recent activities
        let activities: any[] = [];
        try {
            const { data, error } = await supabase
                .from('activities')
                .select('activity_type, start_time, duration_seconds, distance_meters, calories')
                .gte('start_time', startOfHistory.toISOString())
                .order('start_time', { ascending: false })
                .limit(50);
            if (!error) activities = data || [];
            else console.error('ProtocolAI: Error fetching activities', error);
        } catch (e) { console.error('ProtocolAI: Exception fetching activities', e); }

        console.log(`ProtocolAI Context: ${protocols.length} protocols, ${garminStats.length} daily stats, ${trainingStatus.length} training stats, ${activities.length} activities`);

        const result = await streamText({
            model: google('gemini-2.0-flash-exp'),
            messages,
            system: `You are ProtocolAI - an AI research assistant specialized in n=1 self-experimentation and behavioral science.

Your core mission: Help users understand their habit experiments (protocols) through the lens of academic research and their personal health data.

=== YOUR DATA ACCESS ===

PROTOCOLS (User's Experiments):
${JSON.stringify(protocols || [], null, 2)}

HEALTH METRICS (Last 30 Days):
${JSON.stringify(garminStats || [], null, 2)}

TRAINING STATUS:
${JSON.stringify(trainingStatus || [], null, 2)}

RECENT ACTIVITIES:
${JSON.stringify(activities || [], null, 2)}

=== YOUR CAPABILITIES ===

1. **Pattern Analysis**: Identify correlations between protocols and health outcomes (sleep, HRV, body battery, etc.)
2. **Research Synthesis**: Connect user's experiments to peer-reviewed research with proper citations
3. **Hypothesis Generation**: Suggest new protocols based on scientific literature and user's data
4. **Protocol Optimization**: Recommend adjustments to ongoing experiments based on results

=== RESPONSE GUIDELINES ===

**ALWAYS cite sources** when referencing research:
- Format: "According to [Author et al., Year], [finding]..."
- Prefer recent meta-analyses and RCTs
- Link lifestyle metrics (caffeine, sleep, exercise) to measurable outcomes

**Data-Driven Insights**:
- Reference specific data points from user's protocols
- Show before/after comparisons when relevant
- Quantify improvements (e.g., "7% increase in sleep score")

**Actionable Recommendations**:
- Suggest protocol modifications with scientific rationale
- Propose new experiments with expected outcomes
- Recommend optimal timing/dosing based on research
- If data is missing (e.g., "NO DATA" in context), politely ask the user to sync their Garmin device or log more protocol data.

**Style**:
- Concise, evidence-based, scientific but accessible
- Use bullet points for clarity
- Highlight key insights with bold text

Remember: You're a research assistant, not a fitness coach. Focus on scientific evidence and data analysis.`,
            tools: {},
        });

        return result.toTextStreamResponse();
    } catch (error: any) {
        console.error('Fatal Error in ProtocolAI (chat route):', error);
        return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
