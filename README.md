# TaskPilot

TaskPilot is a modern, full-stack collaborative project and task management monorepo application built with TypeScript, Next.js, Express, BullMQ, Drizzle ORM, and PostgreSQL.

---

## 🏗️ Architecture & Project Structure

The project is structured as a Turborepo monorepo powered by Bun workspace package management:

```
taskpilot/
├── apps/
│   ├── client/          # Next.js 16 (App Router), React 19, Tailwind CSS v4, Base UI, TanStack Query
│   ├── server/          # Express 5 REST API + WebSocket server, OpenTelemetry tracing, session auth
│   └── worker/          # BullMQ background worker for asynchronous job processing (emails via Resend)
└── packages/
    ├── config/          # Environment configuration schemas & runtime validations using Zod
    ├── contracts/       # Shared TypeScript request/response contracts and data transfer definitions
    ├── db/              # Drizzle ORM schemas, database connection pool, and relational constraints
    ├── email/           # Email templates, sender integrations, and BullMQ queue definitions
    ├── errors/          # Standardized application error classes and error handling utilities
    ├── eslint-config/   # Shared ESLint configuration rules
    ├── redis/           # Redis client configurations and connection utilities
    ├── typescript-config/# Shared tsconfig configurations
    └── validation/      # Shared Zod validation schemas across client and server
```

---

## ⚡ Tech Stack

- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Monorepo Build System**: [Turborepo](https://turbo.build/)
- **Frontend (`apps/client`)**:
  - [Next.js 16](https://nextjs.org/) (App Router)
  - [React 19](https://react.dev/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [@base-ui/react](https://base-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
  - [@tanstack/react-query](https://tanstack.com/query)
  - [Lucide React](https://lucide.dev/)
- **Backend (`apps/server`)**:
  - [Express 5](https://expressjs.com/)
  - [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
  - [Redis](https://redis.io/) (via `connect-redis` for sessions and caching)
  - [WebSocket (`ws`)](https://github.com/websockets/ws) for real-time capabilities
  - [OpenTelemetry](https://opentelemetry.io/) for observability & tracing
  - [ImageKit](https://imagekit.io/) for media uploads
- **Worker (`apps/worker`)**:
  - [BullMQ](https://docs.bullmq.io/) for reliable background message/job processing
  - [Resend](https://resend.com/) for transactional email delivery
- **Shared Packages**:
  - [Zod 4](https://zod.dev/) for type safety and runtime schema validation
  - Shared TypeScript configurations and strict contracts

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.3.14 or later)
- [Node.js](https://nodejs.org/) (>= 24)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

### Installation

Clone the repository and install dependencies using Bun:

```sh
git clone <repository-url>
cd taskpilot
bun install
```

### Environment Configuration

Configure environment variables across the respective workspaces:

#### 1. Server (`apps/server/.env`)
```env
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
EMAIL_VERIFICATION_BASE_URL=http://localhost:3000/verify
SESSION_SECRET=your_super_secret_session_key
DATABASE_URL=postgresql://postgres:password@localhost:5432/taskpilot
REDIS_URL=redis://localhost:6379
SENDER_EMAIL=no-reply@taskpilot.app
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
```

#### 2. Client (`apps/client/.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_REDIRECT_DELAY=1500
```

#### 3. Worker (`apps/worker/.env`)
```env
REDIS_URL=redis://localhost:6379
RESEND_API_KEY=re_your_resend_api_key
EMAIL_RATE_LIMIT_PER_MINUTE=50
EMAIL_WORKER_CONCURRENCY=5
```

---

## 🛠️ Development & Scripts

### Development

Run all applications concurrently with Turborepo:

```sh
bun run dev
```

Run a specific workspace:

```sh
# Run client only (http://localhost:3000)
bun run dev --filter=client

# Run server only (http://localhost:8000)
bun run dev --filter=server

# Run worker only
bun run dev --filter=worker
```

### Build

Build all packages and applications:

```sh
bun run build
```

Build a specific workspace:

```sh
bun run build --filter=client
```

### Type Checking & Linting

```sh
# Run type checks across all workspaces
bun run check-types

# Run linter
bun run lint

# Format code
bun run format
```

---

## 📐 Architecture & Coding Guidelines

The project follows strict modularity and domain separation conventions:
- **Dependency Boundaries**: Packages (`packages/*`) export types and functions for apps; packages must not import from other packages.
- **Contracts First**: Shared interfaces, request/response models, and types live in `@repo/contracts`.
- **Validation**: Shared validation schemas live in `@repo/validation`.
- **Server Architecture**: Layered architecture in `apps/server` (Routes → Controllers → Services → Repositories) scoped domain-wise (`auth`, `workspace`, `board`, `membership`, `user`).
- **Client Architecture**: Next.js App Router with Server Actions (`useActionState`), TanStack Query (`useQuery` / `useMutation`), and modular components.
