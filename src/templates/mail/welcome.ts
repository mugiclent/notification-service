import type { MailEvent } from '../../types/events.js';
import type { MailContent } from './index.js';

type WelcomeMailEvent = Extract<MailEvent, { type: 'welcome.mail' }>;

export const renderWelcomeMail = (e: WelcomeMailEvent): MailContent => ({
  subject: `Welcome to Katisha, ${e.first_name}!`,
  html: `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
      <h2 style="color:#1a1a1a">Welcome aboard!</h2>
      <p>Hi ${e.first_name},</p>
      <p>Your Katisha account is ready. You can now sign in and start using the platform.</p>
      <p>If you have any questions, our support team is here to help.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
      <p style="color:#888;font-size:12px">The Katisha Team</p>
    </div>
  `.trim(),
});
