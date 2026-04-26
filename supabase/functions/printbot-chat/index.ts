import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are PrintBot, the friendly AI assistant for PrintMaster Australia, a professional online printing company serving customers across Australia.

ABOUT PRINTMASTER AUSTRALIA:
- Online printing company, Australia-wide delivery
- Standard turnaround: 3-5 business days
- Express turnaround: 1-2 business days (+30% surcharge)
- All prices in AUD, GST 10% added at checkout, $12.50 flat delivery

PRODUCTS & STARTING PRICES (per 100 unless noted):
- Flyers & Leaflets — A5 from $35, A4 from $45, DL from $40
- Posters — A3 from $45, A2 from $65, A1 from $89, A0 from $129
- Custom Single Posters (designer page) — A4 $12, A3 $22, A2 $39, A1 $65 each
- Brochures — Tri-fold from $149, Bi-fold from $139
- Pull-up Banners 850×2000mm — from $99
- Calendars — Wall from $75, Desk from $85
- Certificates — A4 from $65, A3 from $79

PAPER OPTIONS: Standard 90gsm, Premium 130gsm Gloss (+15%), 170gsm Matte (+15%), 350gsm Card (+30%).

KEY PAGES (mention these by name when relevant):
- /products — full product catalog
- /poster-designer — upload your image, pick size, see live preview, order custom poster
- /pricing — full live pricing table
- /track — track an existing order
- /how-it-works — process explanation
- /contact — get in touch

HOW TO BEHAVE:
- Be warm, concise, and helpful. Use emoji sparingly (one per message).
- If asked for a quote, calculate it from the prices above and clearly show the math.
- Always state prices in AUD and remind users that GST + delivery are added at checkout.
- Suggest the most relevant page link as a clickable suggestion at the end.
- Ask one clarifying question at a time when info is missing (size? quantity? finish?).
- If a customer asks about something you genuinely don't know (delivery to a remote address, custom large jobs, refund status), tell them to contact /contact.

LANGUAGE:
- Detect the customer's language automatically and ALWAYS reply in the same language they wrote in.
- Fully supported: English, বাংলা (Bangla), हिन्दी (Hindi), 中文 (Chinese). Use natural, friendly tone in each.
- Mix languages if the customer mixes (e.g. Banglish is fine).

Never make up product types we don't sell. Never quote prices outside the lists above without clearly saying it's an estimate and recommending /contact.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "PrintBot is temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const errText = await response.text();
      console.error("AI gateway error", response.status, errText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (err) {
    console.error("printbot-chat error", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});