import type { MailEvent } from '../../types/events.js';
import type { MailContent } from './index.js';

type OrgMailEvent = Extract<MailEvent, { type: `org.${string}` }>;

export const renderOrgMail = (e: OrgMailEvent): MailContent => {
  switch (e.type) {
    case 'org.suspended':
      return {
        subject: `${e.org_name} has been suspended on Katisha`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
            <h2 style="color:#1a1a1a">Organisation Suspended</h2>
            <p>Your organisation <strong>${e.org_name}</strong> has been suspended on Katisha.</p>
            <p>Please contact our support team for more information and to resolve this matter.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
            <p style="color:#888;font-size:12px">The Katisha Team</p>
          </div>
        `.trim(),
      };

    case 'org.rejected':
      return {
        subject: `${e.org_name} application was not approved`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
            <h2 style="color:#1a1a1a">Application Not Approved</h2>
            <p>We regret to inform you that the application for <strong>${e.org_name}</strong> was not approved.</p>
            ${e.reason ? `<p><strong>Reason:</strong> ${e.reason}</p>` : ''}
            <p>If you have questions or would like to appeal this decision, please contact our support team.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
            <p style="color:#888;font-size:12px">The Katisha Team</p>
          </div>
        `.trim(),
      };

    case 'org.contact_otp': {
      const minutes = Math.ceil(e.expires_in_seconds / 60);
      return {
        subject: `Verify your contact email for ${e.org_name}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
            <h2 style="color:#1a1a1a">Verify Your Email</h2>
            <p>Hi ${e.first_name},</p>
            <p>Use the code below to verify the contact email for <strong>${e.org_name}</strong>:</p>
            <div style="background:#f4f4f4;border-radius:8px;padding:24px;text-align:center;margin:24px 0">
              <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#1a1a1a">${e.code}</span>
            </div>
            <p>This code expires in <strong>${minutes} minutes</strong>.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
            <p style="color:#888;font-size:12px">The Katisha Team</p>
          </div>
        `.trim(),
      };
    }

    case 'org.contact_verified':
      return {
        subject: `Contact email verified for ${e.org_name}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
            <h2 style="color:#1a1a1a">Email Verified</h2>
            <p>Hi ${e.first_name},</p>
            <p>The contact email for <strong>${e.org_name}</strong> has been successfully verified.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
            <p style="color:#888;font-size:12px">The Katisha Team</p>
          </div>
        `.trim(),
      };

    case 'org.application_received':
      return {
        subject: `We've received the application for ${e.org_name}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
            <h2 style="color:#1a1a1a">Application Received</h2>
            <p>Thank you for applying to join Katisha.</p>
            <p>We've received the application for <strong>${e.org_name}</strong> (${e.org_type}). Our team will review it and get back to you at <strong>${e.contact_email}</strong>.</p>
            <p>This process usually takes 1–3 business days.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
            <p style="color:#888;font-size:12px">The Katisha Team</p>
          </div>
        `.trim(),
      };
  }
};
