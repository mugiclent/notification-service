import type { MailEvent } from '../../types/events.js';
import type { MailContent } from './index.js';

type SecurityMailEvent = Extract<MailEvent, { type: `security.${string}` }>;

export const renderSecurityMail = (e: SecurityMailEvent): MailContent => {
  switch (e.type) {
    case 'security.login_new_device':
      return {
        subject: 'New sign-in detected on your Katisha account',
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
            <h2 style="color:#1a1a1a">New Sign-In Detected</h2>
            <p>Hi ${e.first_name},</p>
            <p>Your Katisha account was signed in from a new device${e.device ? ` (<strong>${e.device}</strong>)` : ''}.</p>
            <p>If this was you, no action is needed. If you don't recognise this activity, secure your account immediately by changing your password.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
            <p style="color:#888;font-size:12px">The Katisha Team</p>
          </div>
        `.trim(),
      };

    case 'security.password_changed':
      return {
        subject: 'Your Katisha password was changed',
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
            <h2 style="color:#1a1a1a">Password Changed</h2>
            <p>Hi ${e.first_name},</p>
            <p>Your Katisha password was successfully changed.</p>
            <p>If you did not make this change, contact our support team immediately.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
            <p style="color:#888;font-size:12px">The Katisha Team</p>
          </div>
        `.trim(),
      };

    case 'security.account_suspended':
      return {
        subject: 'Your Katisha account has been suspended',
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
            <h2 style="color:#1a1a1a">Account Suspended</h2>
            <p>Hi ${e.first_name},</p>
            <p>Your Katisha account has been suspended. Please contact our support team for more information.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
            <p style="color:#888;font-size:12px">The Katisha Team</p>
          </div>
        `.trim(),
      };

    case 'security.2fa_enabled':
      return {
        subject: 'Two-factor authentication enabled on your Katisha account',
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
            <h2 style="color:#1a1a1a">2FA Enabled</h2>
            <p>Hi ${e.first_name},</p>
            <p>Two-factor authentication has been enabled on your Katisha account. Your account is now more secure.</p>
            <p>If you did not make this change, contact our support team immediately.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
            <p style="color:#888;font-size:12px">The Katisha Team</p>
          </div>
        `.trim(),
      };

    case 'security.2fa_disabled':
      return {
        subject: 'Two-factor authentication disabled on your Katisha account',
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
            <h2 style="color:#1a1a1a">2FA Disabled</h2>
            <p>Hi ${e.first_name},</p>
            <p>Two-factor authentication has been disabled on your Katisha account.</p>
            <p>We recommend re-enabling it to keep your account secure. If you did not make this change, contact our support team immediately.</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
            <p style="color:#888;font-size:12px">The Katisha Team</p>
          </div>
        `.trim(),
      };
  }
};
