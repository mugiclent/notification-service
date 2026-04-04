import type { SmsEvent } from '../../types/events.js';
import { getSmsStrings } from './i18n.js';

type InviteSmsEvent = Extract<SmsEvent, { type: 'invite.sms' }>;

export const renderInviteSms = (e: InviteSmsEvent): string => {
  const hours = Math.ceil(e.expires_in_seconds / 3600);
  return getSmsStrings(e.locale).invite(e.first_name, e.invited_by, e.invite_link, hours);
};
