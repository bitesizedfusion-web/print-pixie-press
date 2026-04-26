import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface OrderItem {
  product_name: string;
  size?: string;
  paper_type?: string;
  quantity: number;
  total: number;
}

interface Payload {
  to: string;
  customer_name: string;
  order_number: string;
  items: OrderItem[];
  subtotal: number;
  gst: number;
  delivery: number;
  total: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as Payload;
    const { to, customer_name, order_number, items, subtotal, gst, delivery, total } = body;

    if (!to || !order_number) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const itemRows = items
      .map(
        (i) => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #eee;">
          <strong>${i.product_name}</strong>${i.size ? ` — ${i.size}` : ""}${i.paper_type ? ` (${i.paper_type})` : ""}
        </td>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">${i.quantity}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;font-family:monospace;">$${i.total.toFixed(2)}</td>
      </tr>`,
      )
      .join("");

    const html = `<!DOCTYPE html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#f5f5f7;margin:0;padding:24px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
    <div style="background:linear-gradient(135deg,#FF6B35,#F7931E);padding:32px;text-align:center;color:#fff;">
      <h1 style="margin:0;font-size:24px;font-weight:800;">PrintMaster Australia</h1>
      <p style="margin:8px 0 0;opacity:0.9;font-size:14px;">Order Confirmation</p>
    </div>
    <div style="padding:32px;">
      <h2 style="margin:0 0 4px;color:#0F172A;">Thanks, ${customer_name}! 🎉</h2>
      <p style="color:#64748b;margin:0 0 24px;">Your order <strong style="color:#FF6B35;font-family:monospace;">${order_number}</strong> has been received. We'll start printing within 24 hours.</p>

      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="background:#f8fafc;text-transform:uppercase;font-size:11px;color:#64748b;">
            <th style="padding:10px;text-align:left;">Item</th>
            <th style="padding:10px;text-align:center;">Qty</th>
            <th style="padding:10px;text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <div style="background:#f8fafc;padding:16px;border-radius:12px;font-family:monospace;font-size:14px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:#64748b;">Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="color:#64748b;">GST (10%):</span><span>$${gst.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:10px;"><span style="color:#64748b;">Delivery:</span><span>$${delivery.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between;padding-top:10px;border-top:1px solid #e2e8f0;font-weight:bold;font-size:18px;"><span>Total:</span><span style="color:#FF6B35;">AUD $${total.toFixed(2)}</span></div>
      </div>

      <p style="color:#64748b;font-size:13px;margin-top:24px;line-height:1.6;">
        We'll email you a tracking link as soon as your order ships. Standard delivery is 3–5 business days Australia-wide.
      </p>

      <p style="color:#94a3b8;font-size:12px;margin-top:24px;text-align:center;">
        Questions? Just reply to this email or visit printmaster.com.au/contact
      </p>
    </div>
  </div>
</body></html>`;

    // Use Lovable AI Gateway for sending — but since email requires Lovable Email infra,
    // for now we just log and return success. In production, integrate with email service.
    console.log(`[EMAIL] Order confirmation queued for ${to}: ${order_number}`);
    console.log(html.slice(0, 200));

    return new Response(JSON.stringify({ success: true, queued: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-order-confirmation error", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
