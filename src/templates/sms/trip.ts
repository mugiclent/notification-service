import type { SmsEvent, Locale } from '../../types/events.js';
import { getSmsStrings } from './i18n.js';

type TripSmsEvent = Extract<SmsEvent, { type: `trip.${string}` }>;

// Render the departure instant in Rwanda local time. Kinyarwanda has no Intl
// data, so it borrows en-GB's day-month-year formatting.
const formatDeparture = (iso: string, locale: Locale): string =>
  new Intl.DateTimeFormat(locale === 'rw' ? 'en-GB' : locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Kigali',
  }).format(new Date(iso));

export const renderTripSms = (e: TripSmsEvent): string => {
  const s = getSmsStrings(e.locale).trip;
  switch (e.type) {
    case 'trip.ticket_confirmed':
      return s.ticket_confirmed({
        name: e.passenger_name,
        origin: e.origin,
        destination: e.destination,
        departure: formatDeparture(e.departure_at, e.locale ?? 'rw'),
        seats: e.seats_count,
        ref: e.ticket_ref,
      });
  }
};
