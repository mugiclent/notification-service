import type { SmsEvent } from '../../types/events.js';

type InviteSmsEvent = Extract<SmsEvent, { type: 'invite.sms' }>;

export const renderInviteSms = (e: InviteSmsEvent): string => {
  const hours = Math.ceil(e.expires_in_seconds / 3600);
  return `Hi ${e.first_name}, you've been invited to join Katisha. Accept your invitation here: ${e.invite_link} (expires in ${hours}h).`;
};
