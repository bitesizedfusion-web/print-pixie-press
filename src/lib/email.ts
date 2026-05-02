// Utility to handle sending emails via a service like Resend or EmailJS
// For it to come from your domain, you'll need to verify your domain in the service dashboard.

export const sendVerificationEmail = async (email: string, code: string) => {
  console.log(`[Email Service] Sending verification code ${code} to ${email} from your-domain.com.au`);
  
  // Example implementation using Resend (Requires API Key)
  /*
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'S&S Printing <no-reply@your-domain.com.au>',
      to: [email],
      subject: 'Your Quote Verification Code',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #333; text-align: center;">Verification Code</h1>
          <p style="font-size: 16px; color: #666; text-align: center;">Thank you for your quote request. Please use the following code to verify your email address:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #000;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #999; text-align: center;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #ccc; text-align: center;">&copy; 2026 S&S Printing and Packaging. All rights reserved.</p>
        </div>
      `,
    }),
  });
  return res.ok;
  */

  // For now, we return true to allow the flow to continue in development
  return true;
};

export const sendQuoteToAdmin = async (formData: any) => {
  console.log(`[Email Service] Sending full quote details to sandsprinters26@gmail.com`);
  // Similar implementation to send the lead to your inbox
  return true;
};
