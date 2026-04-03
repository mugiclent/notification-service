import type { SmsEvent } from '../../types/events.js';

type OrgSmsEvent = Extract<SmsEvent, { type: `org.${string}` }>;

export const renderOrgSms = (e: OrgSmsEvent): string => {
  switch (e.type) {
    case 'org.suspended':
      return `Your organisation ${e.org_name} has been suspended on Katisha. Contact support for more information.`;

    case 'org.rejected':
      return `Your organisation ${e.org_name} was not approved on Katisha${e.reason ? `: ${e.reason}` : ''}. Contact support if you have questions.`;

    case 'org.cooperative_approved':
      return `Great news! ${e.org_name} has been approved as a cooperative on Katisha. Log in to get started.`;

    case 'org.contact_verified':
      return `The contact for ${e.org_name} has been verified on Katisha.`;
  }
};
