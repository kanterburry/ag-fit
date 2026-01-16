import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { OpenAI } from "https://esm.sh/openai@4.28.0";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // 1. Init Clients
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const openai = new OpenAI({
            apiKey: Deno.env.get('OPENAI_API_KEY'),
        });

        // 2. Fetch from Semantic Scholar (Mocking "Sleep/Nutrition" query)
        // Real query: "clinical trials sleep nutrition humans year:2024-"
        const SEMANTIC_URL = "https://api.semanticscholar.org/graph/v1/paper/search";
        const queryParams = new URLSearchParams({
            query: "sleep AND nutrition AND clinical trial",
            limit: "5",
            fields: "title,url,abstract,publicationDate,citationCount",
            year: "2024-",
        });

        console.log(`Searching Semantic Scholar: ${queryParams.toString()}`);
        const searchRes = await fetch(`${SEMANTIC_URL}?${queryParams}`);
        const searchData = await searchRes.json();

        if (!searchData.data || searchData.data.length === 0) {
            return new Response(JSON.stringify({ message: "No papers found" }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const results = [];

        // 3. Process each paper
        for (const paper of searchData.data) {
            // Check if already processed
            const { data: existing } = await supabaseAdmin
                .from('research_sources') // Note: need to handle schema vault_content.research_sources ??
                // Supabase client usually defaults to 'public'. We might need to specify schema.
                .select('external_id')
                .eq('external_id', paper.paperId)
                .maybeSingle();

            if (existing) {
                console.log(`Skipping existing paper: ${paper.paperId}`);
                continue;
            }

            // 4. Save to vault_content.research_sources
            // NOTE: We must verify if "vault_content" schema is accessible or if we need to prefix table?
            // Supabase JS allows .from('table'). But for custom schema? .schema('vault_content').from('research_sources')

            const { data: source, error: sourceError } = await supabaseAdmin
                .schema('vault_content')
                .from('research_sources')
                .insert({
                    external_id: paper.paperId,
                    title: paper.title,
                    url: paper.url,
                    publication_date: paper.publicationDate, // Ensure format YYYY-MM-DD
                    abstract_text: paper.abstract,
                    citation_count: paper.citationCount
                })
                .select()
                .single();

            if (sourceError) {
                console.error("Source Save Error", sourceError);
                continue;
            }

            // 5. Analyze with OpenAI
            if (paper.abstract) {
                const prompt = `
            Analyze this abstract for a potential N-of-1 health protocol.
            Abstract: "${paper.abstract}"
            
            Return JSON only:
            {
                "draft_title": "Short catchy title",
                "draft_hypothesis": "One sentence hypothesis",
                "protocol_type": "PASSIVE" or "ACTIVE" or "HYBRID",
                "variable_name": "What is changed? e.g. Magnesium",
                "target_metric": "What is measured? e.g. sleep_deep_min"
            }
          `;

                const completion = await openai.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: "gpt-4o",
                    response_format: { type: "json_object" }
                });

                const aiContent = JSON.parse(completion.choices[0].message.content);

                // 6. Save to protocols_staging
                const { error: stagingError } = await supabaseAdmin
                    .schema('vault_content')
                    .from('protocols_staging')
                    .insert({
                        source_id: source.source_id,
                        ...aiContent,
                        status: 'PENDING'
                    });

                if (!stagingError) {
                    results.push({ title: paper.title, status: "Drafted" });
                }
            }
        }

        return new Response(JSON.stringify({ success: true, processed: results }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
