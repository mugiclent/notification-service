import type { SmsEvent } from '../../types/events.js';
import { getSmsStrings } from './i18n.js';

type OrgApprovedSmsEvent = Extract<SmsEvent, { type: 'org_approved.sms' }>;

export const renderOrgApprovedSms = (e: OrgApprovedSmsEvent): string => {
  const hours = Math.ceil(e.expires_in_seconds / 3600);
  return getSmsStrings(e.locale).org_approved(e.org_name, e.invite_link, hours);
};
