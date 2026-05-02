export const sendVerificationEmail = async (email: string, code: string) => {
  console.log(`[Email Service] Sending verification code ${code} to ${email}`);
  
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'S&S Printing and Packaging <noreply@phonefixandmore.com>',
        to: [email],
        subject: 'Your Quote Verification Code',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #333; margin: 0;">S&S Printing and Packaging</h2>
              <p style="color: #999; font-size: 12px; margin-top: 5px;">Premium Printing & Packaging Solutions</p>
            </div>
            <h1 style="color: #333; text-align: center; font-size: 24px;">Verification Code</h1>
            <p style="font-size: 16px; color: #666; text-align: center;">Please use the following 4-digit code to verify your quote request:</p>
            <div style="background: #f8f9fa; padding: 30px; text-align: center; border-radius: 15px; margin: 25px 0; border: 1px solid #e9ecef;">
              <span style="font-size: 40px; font-weight: bold; letter-spacing: 15px; color: #000; font-family: monospace;">${code}</span>
            </div>
            <p style="font-size: 13px; color: #999; text-align: center;">This code is valid for 10 minutes. Do not share this code with anyone.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 11px; color: #adb5bd; text-align: center;">&copy; 2026 S&S Printing and Packaging. Australia. All rights reserved.</p>
          </div>
        `,
      }),
    });
    
    if (!res.ok) {
        const error = await res.json();
        console.error("Resend API Error:", error);
        return false;
    }
    return true;
  } catch (err) {
    console.error("Email Service Error:", err);
    return false;
  }
};

export const sendQuoteToAdmin = async (formData: any) => {
  console.log(`[Email Service] Notifying Admin of new verified quote: ${formData.productName}`);
  
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'S&S Quote System <noreply@phonefixandmore.com>',
        to: ['sandsprinters26@gmail.com'],
        subject: `New Quote Request: ${formData.productName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">New Quote Request Details</h2>
            <div style="margin-top: 20px; line-height: 1.6;">
              <p><strong>Customer:</strong> ${formData.firstName} ${formData.surname || ''}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Mobile:</strong> ${formData.mobile}</p>
              <p><strong>Product:</strong> ${formData.productName}</p>
              <p><strong>Quantity:</strong> ${formData.quantity}</p>
              <p><strong>Dimensions:</strong> ${formData.width}x${formData.length}x${formData.height} cm</p>
              <p><strong>Urgency:</strong> ${formData.urgency}</p>
              ${formData.requiredDate ? `<p><strong>Deadline:</strong> ${formData.requiredDate}</p>` : ''}
              <p><strong>Details:</strong> ${formData.details || 'N/A'}</p>
            </div>
            <footer style="margin-top: 30px; font-size: 12px; color: #999;">
              This request has been verified via email.
            </footer>
          </div>
        `,
      }),
    });
    return true;
  } catch (err) {
    console.error("Admin Email Error:", err);
    return false;
  }
};
