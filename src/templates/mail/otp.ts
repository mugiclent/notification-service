import type { MailEvent } from '../../types/events.js';
import type { MailContent } from './index.js';

type OtpMailEvent = Extract<MailEvent, { type: 'otp.mail' }>;

export const renderOtpMail = (e: OtpMailEvent): MailContent => {
  const minutes = Math.ceil(e.expires_in_seconds / 60);
  return {
    subject: 'Your Katisha password reset code',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
        <h2 style="color:#1a1a1a">Password Reset</h2>
        <p>Hi ${e.first_name},</p>
        <p>Use the code below to reset your Katisha password:</p>
        <div style="background:#f4f4f4;border-radius:8px;padding:24px;text-align:center;margin:24px 0">
          <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#1a1a1a">${e.code}</span>
        </div>
        <p>This code expires in <strong>${minutes} minutes</strong>.</p>
        <p>If you did not request a password reset, you can safely ignore this email — your password has not changed.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="color:#888;font-size:12px">The Katisha Team</p>
      </div>
    `.trim(),
  };
};
