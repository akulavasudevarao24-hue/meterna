import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `You are MotherSource AI — an expert maternal healthcare recommendation engine for India. Given a user's profile, provide personalized recommendations in three categories:

1. **Hospitals** (3 recommendations): Suggest hospitals suited to the user's pregnancy risk level and location. Include hospital name, city/district, why it's suitable (ICU, C-section capability, NICU), and an estimated distance category (nearby/moderate/far).

2. **Government Schemes** (3 recommendations): Match eligible government healthcare schemes based on income, rural/urban status, and state. Include scheme name, key benefits, eligibility summary, and how to apply.

3. **NGO Support** (2-3 recommendations): Recommend NGOs providing financial aid, emergency transport, or maternal support. Include organization name, type of support, coverage area, and contact method.

For each category, provide:
- A confidence score (0-100) indicating recommendation reliability
- A brief explanation of your reasoning

Format your response as valid JSON with this structure:
{
  "hospitals": [{ "name": "", "location": "", "suitability": "", "distance": "", "confidence": 0 }],
  "schemes": [{ "name": "", "benefits": "", "eligibility": "", "howToApply": "", "confidence": 0 }],
  "ngos": [{ "name": "", "supportType": "", "coverage": "", "contact": "", "confidence": 0 }],
  "overallConfidence": 0,
  "reasoning": ""
}

Use realistic Indian healthcare data. If the location is vague, use representative options for that region. Always prioritize safety for high-risk pregnancies.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userMessage = `Patient Profile:
- State/Location: ${profile.state}
- District/City: ${profile.district}
- Area Type: ${profile.areaType}
- Monthly Household Income: ₹${profile.income}
- Pregnancy Risk Level: ${profile.riskLevel}
- Gestational Age: ${profile.gestationalAge} weeks
- Additional Notes: ${profile.notes || "None"}

Please provide personalized recommendations.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
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
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    let recommendations;
    try {
      recommendations = JSON.parse(jsonStr);
    } catch {
      // If JSON parsing fails, return the raw content
      recommendations = { raw: content, parseError: true };
    }

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Recommendation error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
