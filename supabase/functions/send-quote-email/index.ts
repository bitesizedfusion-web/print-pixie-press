import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM = "S&S Printing <onboarding@resend.dev>";
const ADMIN = "sandsprinters26@gmail.com";

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", err);
    throw new Error(err);
  }
  return res.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");
    const { type, email, code, formData } = await req.json();

    if (type === "otp") {
      const html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #eee;border-radius:12px;">
          <h2 style="margin:0 0 8px;">S&S Printing and Packaging</h2>
          <p style="color:#666;">Your verification code:</p>
          <div style="background:#f8f9fa;padding:24px;text-align:center;border-radius:12px;margin:20px 0;">
            <span style="font-size:36px;font-weight:bold;letter-spacing:12px;font-family:monospace;">${code}</span>
          </div>
          <p style="font-size:13px;color:#999;">Valid for 10 minutes. Do not share this code.</p>
        </div>`;
      await sendEmail(email, "Your Verification Code", html);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "quote") {
      const { firstName, surname, email: custEmail, mobile, productName, quantity, urgency, requiredDate, details, ...extras } = formData;
      const extrasHtml = Object.entries(extras)
        .filter(([_, v]) => v && v !== "")
        .map(([k, v]) => {
          const label = k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
          return `<p><strong>${label}:</strong> ${v}</p>`;
        })
        .join("");

      const html = `
        <div style="font-family:sans-serif;padding:20px;color:#333;">
          <h2 style="border-bottom:2px solid #000;padding-bottom:10px;">New Verified Quote Request</h2>
          <div style="background:#f9f9f9;padding:20px;border-radius:10px;margin-top:20px;">
            <h3>Customer</h3>
            <p><strong>Name:</strong> ${firstName} ${surname || ""}</p>
            <p><strong>Email:</strong> ${custEmail}</p>
            <p><strong>Mobile:</strong> ${mobile}</p>
          </div>
          <div style="border:1px solid #eee;padding:20px;border-radius:10px;margin-top:20px;">
            <h3>Project</h3>
            <p><strong>Product:</strong> ${productName}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            ${extrasHtml}
            <p><strong>Urgency:</strong> ${urgency}</p>
            ${requiredDate ? `<p><strong>Required:</strong> ${requiredDate}</p>` : ""}
          </div>
          <div style="border:1px solid #eee;padding:20px;border-radius:10px;margin-top:20px;">
            <h3>Details</h3>
            <p>${details || "—"}</p>
          </div>
        </div>`;
      await sendEmail(ADMIN, `New Quote: ${productName}`, html);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid type");
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
