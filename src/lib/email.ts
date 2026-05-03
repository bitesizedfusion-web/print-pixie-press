import { supabase } from "@/integrations/supabase/client";

export const sendVerificationEmail = async (email: string, code: string) => {
  try {
    const { data, error } = await supabase.functions.invoke("send-quote-email", {
      body: { type: "otp", email, code },
    });
    if (error) {
      console.error("OTP send error:", error);
      return false;
    }
    return data?.success === true;
  } catch (err) {
    console.error("Email error:", err);
    return false;
  }
};

export const sendQuoteToAdmin = async (formData: any) => {
  try {
    const { data, error } = await supabase.functions.invoke("send-quote-email", {
      body: { type: "quote", formData },
    });
    if (error) {
      console.error("Quote send error:", error);
      return false;
    }
    return data?.success === true;
  } catch (err) {
    console.error("Admin email error:", err);
    return false;
  }
};
