// Local copy of the canonical event types defined in user-service/src/utils/publishers.ts.
// Keep in sync manually when new event types are added to publishers.ts.
// Source of truth: user-service/src/utils/publishers.ts

export type Locale = 'rw' | 'en' | 'fr';

export type SmsEvent = (
  // ── OTP delivery ──────────────────────────────────────────────────────────
  | {
      type: 'otp.sms';
      purpose: 'phone_verification' | '2fa' | 'password_reset';
      phone_number: string;
      code: string;
      expires_in_seconds: number;
    }
  // ── Welcome / onboarding ──────────────────────────────────────────────────
  | { type: 'welcome.sms'; phone_number: string; first_name: string }
  | { type: 'invite.sms'; phone_number: string; first_name: string; invited_by: string; invite_link: string; expires_in_seconds: number }
  | { type: 'org_approved.sms'; phone_number: string; org_name: string; invite_link: string; expires_in_seconds: number }
  // ── Security events ───────────────────────────────────────────────────────
  | { type: 'security.login_new_device'; phone_number: string; first_name: string; device?: string }
  | { type: 'security.password_changed'; phone_number: string; first_name: string }
  | { type: 'security.account_suspended'; phone_number: string; first_name: string }
  | { type: 'security.2fa_enabled'; phone_number: string; first_name: string }
  | { type: 'security.2fa_disabled'; phone_number: string; first_name: string }
  // ── Org status events ─────────────────────────────────────────────────────
  | { type: 'org.suspended'; phone_number: string; org_name: string }
  | { type: 'org.rejected'; phone_number: string; org_name: string; reason?: string }
  | { type: 'org.cooperative_approved'; phone_number: string; org_name: string }
  | { type: 'org.contact_verified'; phone_number: string; org_name: string }
) & { locale?: Locale };

export type MailEvent = (
  // ── OTP delivery ──────────────────────────────────────────────────────────
  | {
      type: 'otp.mail';
      purpose: 'password_reset' | '2fa' | 'email_verification';
      email: string;
      first_name: string;
      code: string;
      expires_in_seconds: number;
    }
  // ── Welcome / onboarding ──────────────────────────────────────────────────
  | { type: 'welcome.mail'; email: string; first_name: string }
  | { type: 'invite.mail'; email: string; first_name: string; invited_by: string; invite_link: string; expires_in_seconds: number }
  | { type: 'org_approved.mail'; email: string; org_name: string; invite_link: string; expires_in_seconds: number }
  // ── Security events ───────────────────────────────────────────────────────
  | { type: 'security.login_new_device'; email: string; first_name: string; device?: string }
  | { type: 'security.password_changed'; email: string; first_name: string }
  | { type: 'security.account_suspended'; email: string; first_name: string }
  | { type: 'security.2fa_enabled'; email: string; first_name: string }
  | { type: 'security.2fa_disabled'; email: string; first_name: string }
  // ── Org status events ─────────────────────────────────────────────────────
  | { type: 'org.suspended'; email: string; org_name: string }
  | { type: 'org.rejected'; email: string; org_name: string; reason?: string }
  // ── Org application flow ──────────────────────────────────────────────────
  | { type: 'org.contact_otp'; email: string; first_name: string; org_name: string; code: string; expires_in_seconds: number }
  | { type: 'org.contact_verified'; email: string; org_name: string; first_name: string }
  | { type: 'org.application_received'; email: string; org_name: string; contact_email: string; org_type: string }
) & { locale?: Locale };

// The full wire message shape (envelope added by user-service publishers)
export type SmsMessage = SmsEvent & {
  event_id: string;
  version: number;
  source: string;
  timestamp: string;
};

export type MailMessage = MailEvent & {
  event_id: string;
  version: number;
  source: string;
  timestamp: string;
};
