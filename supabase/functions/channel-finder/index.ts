import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `You are MotherSource AI — Engine 1: Mother Onboarding Channel Finder.

You are an intelligence system that helps a maternal health organization discover and rank outreach channels to reach mothers across Andhra Pradesh and Telangana.

Given a target district/city and mother profile (rural/urban), you must auto-discover and classify outreach channels.

For RURAL areas, focus on:
- Medical colleges (e.g. ASRAM Medical College Eluru, Kakatiya Medical College Warangal)
- Government hospitals & district hospitals
- Primary Health Centers (PHCs) & Community Health Centers (CHCs)
- District health offices & NHM district units
- Anganwadi centers & ASHA worker networks
- NGOs working with rural mothers

For URBAN areas, focus on:
- Private hospitals & maternity clinics (e.g. Lotus Hospitals, Fernandez Hospital)
- OB-GYN specialists & pediatricians
- Large corporates with women workforce (TCS, Infosys, Deloitte, Amazon offices)
- Women's clinics & pediatric specialty centers
- Corporate wellness programs
- Urban NGOs (e.g. Dhaatri Mothers Milk Bank)

For each entity discovered, provide:
1. Name
2. Type (hospital/clinic/PHC/corporate/NGO/medical_college/health_office)
3. Category (rural_source or urban_source)
4. Location (city/district)
5. Relevance score (0-100) with explicit reasoning
6. Contact info if known
7. Why this channel matters for mother outreach
8. Suggested outreach approach (1-2 sentences)

Use REAL entities from AP and Telangana. Prioritize accuracy over quantity. If you're uncertain about an entity, say so and lower the confidence score.

Return valid JSON:
{
  "district": "",
  "profile": "",
  "channels": [
    {
      "name": "",
      "type": "",
      "category": "",
      "location": "",
      "relevanceScore": 0,
      "reasoning": "",
      "contactInfo": "",
      "whyItMatters": "",
      "outreachApproach": "",
      "confidence": ""
    }
  ],
  "summary": "",
  "totalDiscovered": 0,
  "coverageAnalysis": ""
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { district, profile, additionalContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userMessage = `Find outreach channels to reach mothers in:
- District/City: ${district}
- Profile: ${profile} (rural/urban/both)
- State(s): Andhra Pradesh and Telangana
${additionalContext ? `- Additional context: ${additionalContext}` : ""}

Discover at least 8-12 real entities. Include a mix of healthcare facilities, NGOs, ${profile === "urban" || profile === "both" ? "corporates, " : ""}and government health infrastructure. Prioritize entities most likely to help onboard 1,000 mothers for a maternal health pilot program.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1].trim();

    let result;
    try {
      result = JSON.parse(jsonStr);
    } catch {
      result = { raw: content, parseError: true };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Channel finder error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
