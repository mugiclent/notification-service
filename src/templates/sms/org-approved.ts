import type { SmsEvent } from '../../types/events.js';

type OrgApprovedSmsEvent = Extract<SmsEvent, { type: 'org_approved.sms' }>;

export const renderOrgApprovedSms = (e: OrgApprovedSmsEvent): string => {
  const hours = Math.ceil(e.expires_in_seconds / 3600);
  return `Congratulations! ${e.org_name} has been approved on Katisha. Set up your organisation here: ${e.invite_link} (expires in ${hours}h).`;
};
