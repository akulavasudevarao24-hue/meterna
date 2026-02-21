import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `You are MotherSource AI — Engine 2: Funding & Partnership Scout.

You are an intelligence system that discovers and ranks organizations that can fund or support maternal health programs. Funders can be from India or globally.

Given a focus area and program description, discover and classify:

1. **Global Foundations** — Gates Foundation India, Patrick J. McGovern Foundation, Wellcome Trust, USAID, Skoll Foundation, Omidyar Network, Ford Foundation, etc.

2. **AI for Social Good Funds** — Google.org, Microsoft AI for Health, Nvidia Foundation, Salesforce.org, AWS IMAGINE Grant, etc.

3. **HNIs & Philanthropists** — Indian and global philanthropists supporting Health, Nutrition, Women & Child Welfare (e.g. Rohini Nilekani, Azim Premji Foundation, etc.)

4. **NGO Implementation Partners** — Organizations working in Maternal Health, Child Nutrition, Preventive Healthcare, Early Childhood Development that could be ground-level partners

5. **Open Grants** — Currently available or recurring grant programs in Health, Healthcare, Maternal Health, Child Nutrition, AI for Social Good

For each entity, provide:
1. Name
2. Type (foundation/corporate_fund/hni/ngo_partner/grant_program)
3. Focus areas (array of strings)
4. Geographic focus
5. Relevance score (0-100) with reasoning
6. Estimated funding capacity (if applicable): small (<$100K), medium ($100K-$1M), large (>$1M)
7. Why they'd fund this
8. How to approach them
9. Contact/website info
10. Priority level (high/medium/low) for outreach

Use REAL organizations. Prioritize accuracy. If uncertain, lower confidence.

Return valid JSON:
{
  "focusArea": "",
  "funders": [
    {
      "name": "",
      "type": "",
      "focusAreas": [],
      "geographicFocus": "",
      "relevanceScore": 0,
      "reasoning": "",
      "fundingCapacity": "",
      "whyTheyFund": "",
      "approachStrategy": "",
      "contactInfo": "",
      "priority": ""
    }
  ],
  "summary": "",
  "totalDiscovered": 0,
  "topRecommendation": ""
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { focusArea, programDescription, fundingType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userMessage = `Find funding sources and implementation partners for:
- Focus Area: ${focusArea || "Maternal Health & Child Nutrition"}
- Program: ${programDescription || "A pilot program to onboard 1,000 mothers across Andhra Pradesh and Telangana for maternal health support, nutrition guidance, and early childhood development."}
- Preferred Funding Types: ${fundingType || "all types"}

Discover at least 10-15 real organizations across all categories (foundations, AI funds, HNIs, NGO partners, grants). Prioritize those most likely to engage with a maternal health pilot in South India. Include both Indian and global funders.`;

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
    console.error("Funding scout error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
