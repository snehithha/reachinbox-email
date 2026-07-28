# 📧 ReachInbox – Full-stack Email Job Scheduler

A production-inspired email scheduling system built as part of the ReachInbox Software Development Intern Assignment.

The application allows users to schedule emails for future delivery, processes them reliably using BullMQ and Redis, persists jobs across restarts, and sends emails through Ethereal SMTP.

---

# 🚀 Tech Stack

## Backend

- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- Redis
- BullMQ
- Nodemailer
- Ethereal Email
- Zod

## Frontend

> 🚧 Under Development

- Next.js
- TypeScript
- Tailwind CSS

---

# 📂 Project Structure

```
backend/
│
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── queue/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── workers/
│   └── app.ts
│
├── prisma/
├── docker-compose.yml
└── package.json
```

---

# ✨ Features Implemented

## Backend

### Email Scheduling

- Schedule emails through REST APIs.
- Store every scheduled email in PostgreSQL.
- Queue delayed jobs using BullMQ.
- Send emails through Ethereal SMTP.

---

### Persistence

The scheduler is fully persistent.

- Scheduled emails are stored in PostgreSQL.
- BullMQ stores delayed jobs inside Redis.
- If the backend or worker restarts, future scheduled emails are still processed correctly.
- Already sent emails are not reprocessed.

---

### Worker Concurrency

Worker concurrency is configurable.

Example:

```env
WORKER_CONCURRENCY=5
```

Multiple jobs can be processed simultaneously while remaining safe through Redis-backed synchronization.

---

### Global Email Throttling

A minimum delay is maintained between every email sent.

Current configuration:

```env
MIN_EMAIL_DELAY=2000
```

Implementation:

- Redis Lua Script
- Atomic send-slot reservation
- Safe across multiple workers
- Safe across multiple backend instances

Example behaviour:

```
Email 1 → immediately

Email 2 → after 2 seconds

Email 3 → after 4 seconds

Email 4 → after 6 seconds
```

This mimics real-world provider throttling.

---

### Hourly Rate Limiting

Per-sender hourly rate limiting is implemented.

Example:

```env
MAX_EMAILS_PER_HOUR=200
```

Implementation:

- Redis-backed counters
- Lua scripting for atomic operations
- Per sender
- Configurable through environment variables

When the hourly limit is exceeded:

- Emails are **not dropped**
- Emails are automatically rescheduled into the next available hour
- Processing resumes automatically

---

### Idempotency

The worker prevents duplicate email sends.

Before processing every job it verifies:

- Email record exists
- Email has not already been marked as `SENT`

This prevents duplicate delivery after retries or restarts.

---

### Retry Support

BullMQ retries failed jobs automatically.

Configuration:

```ts
attempts: 3
```

Failed jobs are marked accordingly inside PostgreSQL.

---

### Validation

All incoming API requests are validated using Zod before processing.

Validation includes:

- Recipient
- Subject
- Body
- Sender
- Scheduled Time

---

# ⚙️ Environment Variables

Example:

```env
DATABASE_URL=

REDIS_HOST=localhost
REDIS_PORT=6379

EMAIL_USER=
EMAIL_PASS=

WORKER_CONCURRENCY=5

MIN_EMAIL_DELAY=2000

MAX_EMAILS_PER_HOUR=200
```

---

# 📌 API

## Schedule Email

```
POST /api/email
```

Example:

```json
{
  "recipient": "user@example.com",
  "sender": "Marketing Team",
  "subject": "Welcome",
  "body": "Hello!",
  "scheduledAt": "2026-08-10T10:00:00Z"
}
```

---

## Get Emails

```
GET /api/email
```

Returns all scheduled and processed emails.

---

# 🏗 Architecture

```
REST API
      │
      ▼
Express
      │
      ▼
Validation (Zod)
      │
      ▼
PostgreSQL (Prisma)
      │
      ▼
BullMQ Queue
      │
      ▼
Redis
      │
      ▼
Worker
      │
      ├── Idempotency Check
      ├── Hourly Rate Limiter
      ├── Global Send Throttle
      ├── SMTP Send
      └── Status Update
```

---

# 🔄 Scheduling Flow

```
Client

    │

    ▼

POST /api/email

    │

    ▼

Store Email (PostgreSQL)

    │

    ▼

Create BullMQ Delayed Job

    │

    ▼

Scheduled Time Reached

    │

    ▼

Worker Picks Job

    │

    ▼

Idempotency Check

    │

    ▼

Hourly Rate Limit Check

    │

    ▼

Reserve Global Send Slot

    │

    ▼

Send Email (SMTP)

    │

    ▼

Update Database
```

---

# 🔁 Restart Behaviour

If the server is restarted:

- BullMQ restores delayed jobs from Redis.
- Future emails continue to execute.
- Previously sent emails are skipped through idempotency checks.
- No cron jobs are used.

---

# Trade-offs

The implementation prioritizes correctness and persistence while remaining simple enough for the assignment.

Current limitations:

- The worker guarantees idempotency for emails marked as `SENT`.
- A rare edge case exists if the SMTP provider accepts an email but the worker crashes before persisting the `SENT` status. In production this would typically be addressed using an Outbox Pattern, provider-supported idempotency, or provider message IDs.

---

# Frontend

🚧 Under Development

Planned features:

- Google OAuth
- Dashboard
- Compose Email
- CSV Upload
- Scheduled Emails
- Sent Emails
- Responsive UI

---