# notification-service

Delivers SMS and email notifications for the Katisha platform. It has no business API — it only consumes events from RabbitMQ and calls third-party delivery providers.

---

## Role in the Katisha platform

```
user-service ──► RabbitMQ (notifications exchange)
                      │
              ┌───────┴────────┐
              ▼                ▼
           sms queue       mail queue
              │                │
              └───────┬────────┘
                      ▼
           notification-service
              │                │
              ▼                ▼
         bulksms.rw         Resend
         (SMS gateway)    (email API)
              │                │
              └───────┬────────┘
                      ▼
              notification_logs (PostgreSQL)
```

The `user-service` publishes fire-and-forget events. This service is the only consumer. It does not expose any routes to the API gateway — it is invisible to clients.

---

## Providers

| Channel | Provider | SDK / client |
|---|---|---|
| SMS | [bulksms.rw](https://bulksms.rw) | Native `fetch` (no SDK) |
| Email | [Resend](https://resend.com) | `resend` npm package |

---

## Infrastructure dependencies

| Dependency | Container | Address | Notes |
|---|---|---|---|
| PostgreSQL | `pgbouncer` | `pgbouncer:6432` | Always via pgbouncer — never direct to `db:5432` |
| RabbitMQ | `rabbitmq` | `rabbitmq:5672` | AMQP — 2 channels, one per queue |
| Docker network | `katisha-net` | external bridge | All services communicate by container name |

---

## RabbitMQ topology

```
notifications exchange (topic)
  ├── sms  queue  ←── routing key: sms.notifications  ──► DLX on failure
  └── mail queue  ←── routing key: mail.notifications ──► DLX on failure

notifications.dlx exchange (fanout) — dead-letter sink
  └── notifications.dead queue ←── exhausted messages land here for manual inspection
```

**Two independent AMQP channels** — one for `sms`, one for `mail`, each with `prefetch(1)`. An SMS retry sleeping up to 8s does not block mail delivery. The message stays UNACKED throughout the retry window; if the process crashes mid-retry, the broker requeues it automatically.

> **Warning:** The `sms`, `mail`, and `push` queues must be declared with `x-dead-letter-exchange: notifications.dlx`. RabbitMQ queue arguments are immutable. If queues were previously created without DLX, delete them in the management UI and restart the rabbitmq container to recreate from `definitions.json`.

---

## Retry policy

Each delivery is attempted up to 3 times:

| Attempt | Delay before attempt |
|---|---|
| 1 | immediate |
| 2 | 2 seconds |
| 3 | 8 seconds |

- **HTTP 4xx** (except 429): unrecoverable — nacked immediately → DLX. Bad data won't fix itself on retry.
- **HTTP 429, 5xx, network errors**: retryable — waits and retries.
- After 3 failed attempts: message is nacked → moves to `notifications.dead` queue.

---

## Dead-letter handling

Messages in `notifications.dead` require manual intervention:

1. Inspect in the RabbitMQ management UI (`rabbitmq:15672`)
2. Cross-reference with `notification_logs` (`status = 'dead'`) to see the error details and full payload
3. Fix the root cause
4. Shovel the message back to the `sms` or `mail` queue manually

There is no automatic re-queue — that would create infinite loops.

---

## Database

One table: `notification_logs`. One row per delivery attempt.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `channel` | enum `sms\|mail` | Delivery channel |
| `type` | varchar(60) | Event type e.g. `otp.sms`, `security.login_new_device` |
| `recipient` | varchar(255) | Phone number (SMS) or email address (mail) |
| `status` | enum `sent\|failed\|dead` | Final delivery outcome |
| `attempts` | int | Number of attempts made (1–3) |
| `provider_ref` | varchar(255) | `trackId` from bulksms.rw or message ID from Resend |
| `error` | text | Last error message if failed/dead |
| `payload` | json | Full event body for debugging and support lookups |
| `created_at` | timestamp | When the event was first received |
| `updated_at` | timestamp | Last status update |

Indexes on `(channel, status)` and `(recipient)` for support queries like "why didn't this user receive the SMS?".

---

## Template system

Templates are pure functions — no I/O, no side effects.

- **SMS**: `(event) => string`
- **Mail**: `(event) => { subject: string; html: string }`

A dispatch table in `src/templates/sms/index.ts` and `src/templates/mail/index.ts` switches exhaustively on `event.type`. TypeScript's discriminated union gives a compile error if a new event type is added without a corresponding template case.

### Adding a new notification type

1. Add the event type to `user-service/src/utils/publishers.ts` (canonical type registry)
2. Add the same type to `src/types/events.ts` in this repo (local copy — keep in sync)
3. Create or edit the template file (e.g. `src/templates/mail/my-template.ts`)
4. Add a `case` to the dispatch switch in `src/templates/mail/index.ts`
5. Zero changes to subscribers or services

### Internationalisation (i18n)

All user-facing strings live in two files:
- `src/templates/mail/i18n.ts` — all mail strings, 3 locales
- `src/templates/sms/i18n.ts` — all SMS strings, 3 locales

Supported locales: **Kinyarwanda (`rw`)** (default), **English (`en`)**, **French (`fr`)**.

The `locale` field is optional on every event payload. The `user-service` knows the user's locale at publish time and includes it. The notification-service is stateless — it never looks up user preferences.

Adding a fourth language = edit only those two files. TypeScript enforces that every locale has all strings.

---

## Supported event types

### Mail (`mail` queue)

| Event type | Description |
|---|---|
| `otp.mail` | OTP code — purposes: `password_reset`, `2fa`, `email_verification` |
| `welcome.mail` | New passenger account created |
| `invite.mail` | Staff member invited to join (includes `invited_by` name) |
| `org_approved.mail` | Organisation approved, includes setup link |
| `security.login_new_device` | Sign-in from a new device |
| `security.password_changed` | Password successfully changed |
| `security.account_suspended` | Account suspended |
| `security.2fa_enabled` | Two-factor authentication enabled |
| `security.2fa_disabled` | Two-factor authentication disabled |
| `org.suspended` | Organisation suspended |
| `org.rejected` | Organisation application rejected (includes optional reason) |
| `org.contact_otp` | OTP to verify organisation contact email |
| `org.contact_verified` | Organisation contact email verified |
| `org.application_received` | Organisation application received confirmation |

### SMS (`sms` queue)

| Event type | Description |
|---|---|
| `otp.sms` | OTP code — purposes: `phone_verification`, `2fa`, `password_reset` |
| `welcome.sms` | New account welcome message |
| `invite.sms` | Staff invitation with link (includes `invited_by` name) |
| `org_approved.sms` | Organisation approved with setup link |
| `security.login_new_device` | Sign-in from new device alert |
| `security.password_changed` | Password changed alert |
| `security.all_sessions_revoked` | All sessions ended |
| `security.account_suspended` | Account suspended alert |
| `security.2fa_enabled` | 2FA enabled confirmation |
| `security.2fa_disabled` | 2FA disabled warning |
| `org.suspended` | Organisation suspended |
| `org.rejected` | Organisation application rejected |
| `org.cooperative_approved` | Organisation approved as cooperative |
| `org.contact_verified` | Organisation contact verified |

---

## Resilience

- **Startup**: both Prisma and RabbitMQ retry indefinitely with 3s backoff until their dependencies are ready. The service does not crash on startup if the DB or broker is not yet up.
- **Runtime**: if the RabbitMQ connection drops unexpectedly, the service reconnects automatically after 3s. A `isShuttingDown` flag prevents reconnect during graceful shutdown.
- **Graceful shutdown**: `SIGTERM`/`SIGINT` closes the HTTP server, disconnects Prisma, and closes both AMQP channels cleanly.

---

## Environment variables

All app secrets are stored in **Infisical** at path `/notification-svc` (project: katisha, env: dev). They are injected at container startup via `infisical run`. See `actions.env` for the full list of GitHub Actions secrets required for deployment.

| Variable | Description |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `8100` |
| `DB_PASSWORD` | Password for the `notification_svc` postgres user |
| `RABBITMQ_USER` | RabbitMQ username — same value as in Infisical `/rabbitmq` |
| `RABBITMQ_PASSWORD` | RabbitMQ password — same value as in Infisical `/rabbitmq` |
| `BULKSMS_API_KEY` | API key from bulksms.rw dashboard |
| `BULKSMS_SENDER_ID` | Approved sender ID on bulksms.rw (e.g. `KATISHA`) |
| `RESEND_API_KEY` | Resend API key (`re_...`) |
| `MAIL_FROM` | From address — domain must be verified in Resend (e.g. `Katisha <no-reply@katisha.rw>`) |
| `LOGO_URL` | Full public URL to the white Katisha logo shown in email headers |

Connection strings are **constructed in code** from these credentials using fixed hostnames (`pgbouncer:6432`, `rabbitmq:5672`). No full URLs are stored in secrets.

---

## Database setup (first deploy)

The `db` repo handles this automatically on every push via its deploy workflow. To do it manually:

```bash
# 1. Create the user and database (idempotent)
docker exec -i db psql -U <POSTGRES_USER> < db/init/05-notification.sql

# 2. Set the password
docker exec db psql -U <POSTGRES_USER> -d postgres \
  -c "ALTER USER notification_svc WITH PASSWORD '<DB_PASSWORD>';"

# 3. Run Prisma migrations
npx prisma db push
```

The `notification_db` entry in `pgbouncer/config/pgbouncer.ini` is already present in the pgbouncer repo.

---

## Dockerfile notes

The runtime image is `node:22-bookworm-slim`. **OpenSSL must be explicitly installed** in the runtime stage:

```dockerfile
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
```

`bookworm-slim` strips OpenSSL to reduce image size. Prisma's native binary links against it at runtime and will crash on startup without it — regardless of whether the database connection uses TLS. This applies to **any Katisha service that uses Prisma on bookworm-slim**.

---

## Health check

```
GET /health
→ 200 { "status": "ok", "timestamp": "..." }
```

The Docker `HEALTHCHECK` polls this endpoint every 30s. The service is considered healthy once it has connected to both the database and RabbitMQ and is listening on port 8100.

---

## Local development

```bash
# Copy and fill in credentials
cp .env.example .env

# Start postgres + rabbitmq + the service
docker compose -f docker-compose.local.yml up --build

# RabbitMQ management UI
open http://localhost:15673   # guest / guest
```

Publish a test event via the management UI:
- **Exchange**: `notifications`
- **Routing key**: `mail.notifications`
- **Body**:
```json
{
  "event_id": "00000000-0000-0000-0000-000000000001",
  "version": 1,
  "source": "user-service",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "type": "welcome.mail",
  "email": "you@example.com",
  "first_name": "Test"
}
```
