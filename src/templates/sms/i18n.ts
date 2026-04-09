import type { Locale } from '../../types/events.js';

// ── Types ──────────────────────────────────────────────────────────────────────

type OtpSmsStrings = {
  purposes: Record<'phone_verification' | '2fa' | 'password_reset', string>;
  template: (purpose: string, code: string, min: number) => string;
};

type SmsLocaleStrings = {
  otp: OtpSmsStrings;
  welcome: (name: string) => string;
  invite: (name: string, invitedBy: string, link: string, hrs: number) => string;
  org_approved: (org: string, link: string, hrs: number) => string;
  security: {
    login_new_device: (name: string, device?: string) => string;
    password_changed: (name: string) => string;
    account_suspended: (name: string) => string;
    '2fa_enabled': (name: string) => string;
    '2fa_disabled': (name: string) => string;
  };
  org: {
    suspended: (org: string) => string;
    rejected: (org: string, reason?: string) => string;
    cooperative_approved: (org: string) => string;
    contact_verified: (org: string) => string;
  };
};

// ── Translations ───────────────────────────────────────────────────────────────

const translations: Record<Locale, SmsLocaleStrings> = {

  // ── Kinyarwanda ─────────────────────────────────────────────────────────────
  rw: {
    otp: {
      purposes: {
        phone_verification: 'kwemeza nimero yawe ya telefoni',
        '2fa': 'kwemeza kwinjira kwawe',
        password_reset: `guhindura ijambo ryawe ry'ibanga`,
      },
      template: (purpose, code, min) =>
        `Kode ya Katisha yo ${purpose} ni: ${code}. Imara iminota ${min}. Ntuyisangize undi muntu.`,
    },
    welcome: (name) =>
      `Murakaza neza kuri Katisha, ${name}! Konti yawe yafunguwe neza. Injira utangire gukatisha.`,
    invite: (name, invitedBy, link, hrs) =>
      `Muraho ${name}, ${invitedBy} yagutumiye kujya kuri Katisha. Emera ubutumire bwawe hano: ${link} (Burarangira mu masaha ${hrs}).`,
    org_approved: (org, link, hrs) =>
      `Amakuru meza! ${org} yemejwe kuri Katisha. Rangiza gukora konti ya ${org} hano: ${link} (Birarangira mu masaha ${hrs}).`,
    security: {
      login_new_device: (name, device) =>
        `Muraho ${name}, konti yawe ya Katisha yinjiriwe ${device ? `kuri ${device}` : 'ku gikoresho gishya'}. Niba ari wowe, irengagize ubu butumwa. Niba atari wowe, rinda konti yawe vuba.`,
      password_changed: (name) =>
        `Muraho ${name}, ijambo ry'ibanga ryawe rya Katisha ryahindutse. Niba utabikoze, vugana na serivisi yacu y'ubufasha vuba.`,
      account_suspended: (name) =>
        `Muraho ${name}, konti yawe ya Katisha yahagaritswe. Vugana na serivisi yacu y'ubufasha kugira amakuru.`,
      '2fa_enabled': (name) =>
        `Muraho ${name}, Kwinjira ukoresheje ibimenyetso birenga kimwe byemejwe kuri konti yawe ya Katisha.`,
      '2fa_disabled': (name) =>
        `Muraho ${name}, Kwinjira ukoresheje ibimenyetso birenga kimwe bivanyweho kuri konti yawe ya Katisha. Turagusaba kubishyiraho nanone kugira ngo konti yawe irindwe neza.`,
    },
    org: {
      suspended: (org) =>
        `Kompanyi yawe ${org} yahagaritswe kuri Katisha. ku bindi bisobanuro vugana na serivisi yacu y'ubufasha.`,
      rejected: (org, reason) =>
        `Kompanyi yawe ${org} ntabwo yemejwe kuri Katisha ku mpamvu zikurira:${reason ? `: ${reason}` : ''}. ku bindi bisobanuro vugana na serivisi yacu y'ubufasha.`,
      cooperative_approved: (org) =>
        `Amakuru meza! ${org} yemeye ko uri umunyamuryango kuri Katisha. Turagubiza bidatinze maze utangire gukatisha.`,
      contact_verified: (org) =>
        `Nomero ikoreshwa na ${org} yemejwe kuri Katisha. Niyo muzajya mubonaho amakuru y'ingenzi yerekeye ${org}.`,
    },
  },

  // ── English ──────────────────────────────────────────────────────────────────
  en: {
    otp: {
      purposes: {
        phone_verification: 'verify your phone number',
        '2fa': 'confirm your sign-in',
        password_reset: 'reset your password',
      },
      template: (purpose, code, min) =>
        `Your Katisha code to ${purpose} is: ${code}. Valid for ${min} min. Do not share this code.`,
    },
    welcome: (name) =>
      `Welcome to Katisha, ${name}! Your account is ready. Sign in now to get started.`,
    invite: (name, invitedBy, link, hrs) =>
      `Hi ${name}, ${invitedBy} has invited you to join Katisha. Accept your invitation here: ${link} (expires in ${hrs}h).`,
    org_approved: (org, link, hrs) =>
      `Congratulations! ${org} has been approved on Katisha. Set up your organisation here: ${link} (expires in ${hrs}h).`,
    security: {
      login_new_device: (name, device) =>
        `Hi ${name}, your Katisha account was accessed from ${device ? `${device}` : 'a new device'}. If this wasn't you, secure your account immediately.`,
      password_changed: (name) =>
        `Hi ${name}, your Katisha password was changed. If you didn't do this, contact support immediately.`,
      account_suspended: (name) =>
        `Hi ${name}, your Katisha account has been suspended. Contact support for assistance.`,
      '2fa_enabled': (name) =>
        `Hi ${name}, two-factor authentication has been enabled on your Katisha account.`,
      '2fa_disabled': (name) =>
        `Hi ${name}, two-factor authentication has been disabled on your Katisha account. Re-enable it to keep your account secure.`,
    },
    org: {
      suspended: (org) =>
        `Your organisation ${org} has been suspended on Katisha. Contact support for more information.`,
      rejected: (org, reason) =>
        `Your organisation ${org} was not approved on Katisha${reason ? `: ${reason}` : ''}. Contact support if you have questions.`,
      cooperative_approved: (org) =>
        `Great news! ${org} has been approved as a cooperative on Katisha. Log in to get started.`,
      contact_verified: (org) =>
        `The contact for ${org} has been verified on Katisha.`,
    },
  },

  // ── French ───────────────────────────────────────────────────────────────────
  fr: {
    otp: {
      purposes: {
        phone_verification: 'vérifier votre numéro de téléphone',
        '2fa': 'confirmer votre connexion',
        password_reset: 'réinitialiser votre mot de passe',
      },
      template: (purpose, code, min) =>
        `Votre code Katisha pour ${purpose} est : ${code}. Valable ${min} min. Ne partagez pas ce code.`,
    },
    welcome: (name) =>
      `Bienvenue sur Katisha, ${name} ! Votre compte est prêt. Connectez-vous maintenant pour commencer.`,
    invite: (name, invitedBy, link, hrs) =>
      `Bonjour ${name}, ${invitedBy} vous a invité(e) à rejoindre Katisha. Acceptez votre invitation ici : ${link} (expire dans ${hrs}h).`,
    org_approved: (org, link, hrs) =>
      `Félicitations ! ${org} a été approuvé(e) sur Katisha. Configurez votre organisation ici : ${link} (expire dans ${hrs}h).`,
    security: {
      login_new_device: (name, device) =>
        `Bonjour ${name}, votre compte Katisha a été accédé depuis ${device ? device : 'un nouvel appareil'}. Si ce n'était pas vous, sécurisez votre compte immédiatement.`,
      password_changed: (name) =>
        `Bonjour ${name}, votre mot de passe Katisha a été modifié. Si vous n'êtes pas à l'origine de cette action, contactez le support immédiatement.`,
      account_suspended: (name) =>
        `Bonjour ${name}, votre compte Katisha a été suspendu. Contactez le support pour obtenir de l'aide.`,
      '2fa_enabled': (name) =>
        `Bonjour ${name}, l'authentification à deux facteurs a été activée sur votre compte Katisha.`,
      '2fa_disabled': (name) =>
        `Bonjour ${name}, l'authentification à deux facteurs a été désactivée sur votre compte Katisha. Réactivez-la pour sécuriser votre compte.`,
    },
    org: {
      suspended: (org) =>
        `Votre organisation ${org} a été suspendue sur Katisha. Contactez le support pour plus d'informations.`,
      rejected: (org, reason) =>
        `Votre organisation ${org} n'a pas été approuvée sur Katisha${reason ? ` : ${reason}` : ''}. Contactez le support si vous avez des questions.`,
      cooperative_approved: (org) =>
        `Bonne nouvelle ! ${org} a été approuvée en tant que coopérative sur Katisha. Connectez-vous pour commencer.`,
      contact_verified: (org) =>
        `Le contact de ${org} a été vérifié sur Katisha.`,
    },
  },
};

export const getSmsStrings = (locale?: Locale): SmsLocaleStrings =>
  translations[locale ?? 'rw'];
