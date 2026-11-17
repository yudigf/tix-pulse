# TixPulse

> Modern, High-Performance Ticketing Platform built with NestJS Modular Monolith, PostgreSQL, Redis Distributed Locking, and RabbitMQ.

---

## 🚀 Overview

TixPulse is an end-to-end ticketing platform designed for high-concurrency event sales ("war tiket"), supporting both:
- **General Admission (GA):** Quota-based inventory (festivals, seminars, outdoor adventures, parks).
- **Reserved Seating:** Interactive seat maps with atomic seat locking (concerts, theaters, stadiums).

---

## 🏗️ Architecture & Project Structure

```text
TixPulse/
├── .github/workflows/       # CI/CD Quality Gate & Deployment Pipelines
├── apps/                    # Frontend Clients (Web, Admin EO, Mobile)
├── docs/                    # Architecture & Git Workflow Documentation
├── infra/                   # Docker Compose & Infrastructure Config
├── packages/                # Shared Types & Contracts
│   └── shared-types/
└── services/                # Backend Services
    └── core-api/            # NestJS Modular Monolith API
```

---

## 🛠️ Tech Stack

- **Core Backend:** NestJS 12, TypeScript, Prisma ORM 6
- **Database:** PostgreSQL 16 (ACID Transactions & Row-Level Locking)
- **Cache & Concurrency:** Redis 7 (Append-Only persistence, atomic seat locking)
- **Message Broker:** RabbitMQ 3 (Asynchronous e-ticket issuance & notifications)
- **CI/CD:** GitHub Actions (Automated quality gate, linting, tests, docker builds)

---

## 🚦 Quick Start (Local Development)

### 1. Prerequisites
- Docker & Docker Compose
- Node.js 22+ & npm

### 2. Start Supporting Infrastructure
```bash
docker compose -f infra/docker-compose.yml up -d
```
Services started:
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`
- RabbitMQ on `localhost:5672` (Management UI: `http://localhost:15672`)

### 3. Run Core API
```bash
cd services/core-api
cp .env.example .env
npm install --legacy-peer-deps
npx prisma db push
npm run start:dev
```

### 4. Running Tests & Quality Checks
```bash
npm test          # Run Vitest unit & integration tests
npm run lint      # Code style & lint check
npm run build     # Verify compilation
```

---

## 🔄 Git Branching & Deployment Strategy

TixPulse follows a strict promotion pipeline:
`feature/*` ➔ `develop` ➔ `staging` ➔ `main` (Production)

Every pull request must pass the automated GitHub Quality Gate before merging.  
See detailed documentation in [docs/git-workflow.md](docs/git-workflow.md).
