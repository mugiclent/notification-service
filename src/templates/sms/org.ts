import type { SmsEvent } from '../../types/events.js';
import { getSmsStrings } from './i18n.js';

type OrgSmsEvent = Extract<SmsEvent, { type: `org.${string}` }>;

export const renderOrgSms = (e: OrgSmsEvent): string => {
  const s = getSmsStrings(e.locale).org;
  switch (e.type) {
    case 'org.suspended':             return s.suspended(e.org_name);
    case 'org.rejected':              return s.rejected(e.org_name, e.reason);
    case 'org.cooperative_approved':  return s.cooperative_approved(e.org_name);
    case 'org.contact_verified':      return s.contact_verified(e.org_name);
  }
};
