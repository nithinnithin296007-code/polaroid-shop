const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const STATUS_MESSAGES = {
  processing: {
    subject: '🎨 Your FrameOnyx Order is Being Prepared!',
    body: (name, items) => `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #FAFAF7; border-radius: 16px; overflow: hidden; border: 2px solid #1A1A2E;">
        <div style="background: #1A1A2E; padding: 2rem; text-align: center;">
          <h1 style="color: #FF6B9D; font-size: 1.8rem; margin: 0;">FrameOnyx</h1>
          <p style="color: #aaa; margin: 8px 0 0; font-size: 14px;">Hold your favorite memories in your hand</p>
        </div>
        <div style="padding: 2rem;">
          <h2 style="color: #1A1A2E; font-size: 1.4rem;">Hey ${name}! 👋</h2>
          <p style="color: #555; line-height: 1.7;">Great news! Your order is now being prepared by our team. We're printing your memories with love! 🎨</p>
          <div style="background: #fff; border: 2px solid #1A1A2E; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0;">
            <h3 style="color: #1A1A2E; margin: 0 0 1rem;">Your Items:</h3>
            ${items.map(i => `<p style="margin: 6px 0; color: #555;">📸 ${i.name} × ${i.qty} — ₹${i.price * i.qty}</p>`).join('')}
          </div>
          <p style="color: #555; line-height: 1.7;">We'll notify you once your order is shipped! 🚚</p>
          <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px dashed #eee; text-align: center;">
            <p style="color: #aaa; font-size: 13px;">Questions? WhatsApp us at <a href="https://wa.me/919710194144" style="color: #FF6B9D;">+91 97101 94144</a> or DM <a href="https://instagram.com/frameonyx" style="color: #FF6B9D;">@frameonyx</a></p>
          </div>
        </div>
      </div>
    `,
  },
  shipped: {
    subject: '🚚 Your FrameOnyx Order is On Its Way!',
    body: (name, items) => `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #FAFAF7; border-radius: 16px; overflow: hidden; border: 2px solid #1A1A2E;">
        <div style="background: #1A1A2E; padding: 2rem; text-align: center;">
          <h1 style="color: #FF6B9D; font-size: 1.8rem; margin: 0;">FrameOnyx</h1>
          <p style="color: #aaa; margin: 8px 0 0; font-size: 14px;">Hold your favorite memories in your hand</p>
        </div>
        <div style="padding: 2rem;">
          <h2 style="color: #1A1A2E; font-size: 1.4rem;">It's on its way, ${name}! 🚀</h2>
          <p style="color: #555; line-height: 1.7;">Your order has been shipped and is heading your way. Expect delivery in 1–3 business days!</p>
          <div style="background: #4ECDC420; border: 2px solid #4ECDC4; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; text-align: center;">
            <p style="font-size: 2rem; margin: 0;">📦</p>
            <p style="color: #1A1A2E; font-weight: 700; margin: 8px 0 0;">Your package is on the move!</p>
          </div>
          <div style="background: #fff; border: 2px solid #1A1A2E; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0;">
            <h3 style="color: #1A1A2E; margin: 0 0 1rem;">Order Summary:</h3>
            ${items.map(i => `<p style="margin: 6px 0; color: #555;">📸 ${i.name} × ${i.qty} — ₹${i.price * i.qty}</p>`).join('')}
          </div>
          <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px dashed #eee; text-align: center;">
            <p style="color: #aaa; font-size: 13px;">Questions? WhatsApp us at <a href="https://wa.me/919710194144" style="color: #FF6B9D;">+91 97101 94144</a></p>
          </div>
        </div>
      </div>
    `,
  },
  delivered: {
    subject: '🎉 Your FrameOnyx Order Has Been Delivered!',
    body: (name, items) => `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #FAFAF7; border-radius: 16px; overflow: hidden; border: 2px solid #1A1A2E;">
        <div style="background: #1A1A2E; padding: 2rem; text-align: center;">
          <h1 style="color: #FF6B9D; font-size: 1.8rem; margin: 0;">FrameOnyx</h1>
          <p style="color: #aaa; margin: 8px 0 0; font-size: 14px;">Hold your favorite memories in your hand</p>
        </div>
        <div style="padding: 2rem;">
          <h2 style="color: #1A1A2E; font-size: 1.4rem;">Delivered! 🎉 Enjoy, ${name}!</h2>
          <p style="color: #555; line-height: 1.7;">Your order has been delivered! We hope you absolutely love your prints. Tag us on Instagram and share your setup! 📸</p>
          <div style="background: #FFE13520; border: 2px solid #FFE135; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; text-align: center;">
            <p style="font-size: 2rem; margin: 0;">🌟</p>
            <p style="color: #1A1A2E; font-weight: 700; margin: 8px 0 4px;">Love your order?</p>
            <p style="color: #555; font-size: 13px; margin: 0;">Tag <strong>@frameonyx</strong> on Instagram!</p>
          </div>
          <div style="text-align: center; margin-top: 1.5rem;">
            <a href="https://instagram.com/frameonyx" style="display: inline-block; background: #FF6B9D; color: white; padding: 12px 28px; border-radius: 12px; text-decoration: none; font-weight: 700;">📸 Tag Us on Instagram</a>
          </div>
          <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px dashed #eee; text-align: center;">
            <p style="color: #aaa; font-size: 13px;">Need help? WhatsApp <a href="https://wa.me/919710194144" style="color: #FF6B9D;">+91 97101 94144</a></p>
          </div>
        </div>
      </div>
    `,
  },
};

const sendStatusEmail = async (to, name, status, items) => {
  const template = STATUS_MESSAGES[status];
  if (!template) return;
  try {
    await transporter.sendMail({
      from: `"FrameOnyx 📸" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.body(name, items),
    });
    console.log(`✅ Email sent to ${to} for status: ${status}`);
  } catch (err) {
    console.error('❌ Email error:', err.message);
  }
};

module.exports = { sendStatusEmail };