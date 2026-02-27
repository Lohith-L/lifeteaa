import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const crisisKeywords = [
  "kill myself", "end my life", "don't want to live", "suicide",
  "hurt myself", "want to die", "no reason to live", "don't want to exist"
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text } = await req.json();
    if (!text) throw new Error("No text provided");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Crisis keyword check
    const lowerText = text.toLowerCase();
    const isCrisis = crisisKeywords.some(k => lowerText.includes(k));

    // AI emotion detection
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an emotion classifier. Analyze the text and return a JSON response with:
- "emotion": one of [Happy, Sad, Frustrated, Excited, Anxious, Angry, Hopeless, Stressed, Hopeful, Confused, Reflective, Neutral, Overwhelmed, Insecure]
- "emoji": the matching emoji
- "confidence": 0-100
- "toxic": boolean (true if content is hateful/harmful/toxic)
- "riskLevel": "low", "high", or "critical" based on mental health risk
- "cognitiveDistortions": array of any detected distortions like ["self-blame", "catastrophizing", "all-or-nothing"]
- "supportMessage": a brief, warm, validating message (1-2 sentences)

Respond ONLY with valid JSON.`
          },
          { role: "user", content: text }
        ],
        tools: [{
          type: "function",
          function: {
            name: "classify_emotion",
            description: "Classify the emotion of the given text",
            parameters: {
              type: "object",
              properties: {
                emotion: { type: "string", enum: ["Happy", "Sad", "Frustrated", "Excited", "Anxious", "Angry", "Hopeless", "Stressed", "Hopeful", "Confused", "Reflective", "Neutral", "Overwhelmed", "Insecure"] },
                emoji: { type: "string" },
                confidence: { type: "number" },
                toxic: { type: "boolean" },
                riskLevel: { type: "string", enum: ["low", "high", "critical"] },
                cognitiveDistortions: { type: "array", items: { type: "string" } },
                supportMessage: { type: "string" }
              },
              required: ["emotion", "emoji", "confidence", "toxic", "riskLevel", "supportMessage"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "classify_emotion" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let result = { emotion: "Neutral", emoji: "😐", confidence: 50, toxic: false, riskLevel: "low", supportMessage: "", cognitiveDistortions: [] };
    
    if (toolCall?.function?.arguments) {
      try {
        result = JSON.parse(toolCall.function.arguments);
      } catch {}
    }

    // Override risk if crisis keywords detected
    if (isCrisis) {
      result.riskLevel = "critical";
      result.supportMessage = "It sounds like you're going through something really difficult. You deserve support. Please consider reaching out to a crisis helpline.";
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-emotion error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
