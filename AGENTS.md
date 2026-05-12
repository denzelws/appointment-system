# Project Guidelines

## Project Overview

This is an appointment scheduling system with a separate TypeScript backend and React frontend.

The backend exposes authentication and appointment APIs, enforces domain rules, persists data in PostgreSQL, and records audit events. The frontend provides login, registration, appointment creation, appointment listing, and admin confirmation flows.

## Stack

- Backend: TypeScript, Fastify, Knex, PostgreSQL, Zod, JWT, bcrypt, Vitest
- Frontend: React, Vite, TypeScript, React Router, Axios, Tailwind CSS, React Hook Form, Zod
- Database: PostgreSQL with `btree_gist` for appointment overlap exclusion

## Folder Responsibilities

- `backend/src/domain`: entities, value objects, domain rules, domain errors, repository interfaces
- `backend/src/application`: use cases and DTOs
- `backend/src/infrastructure`: app setup, database config, Knex repositories, migrations, seeds, JWT/bcrypt services
- `backend/src/interfaces`: HTTP server, routes, controllers, middleware, request schemas
- `frontend/src/pages`: route-level UI screens
- `frontend/src/components`: reusable UI, layout, and dashboard components
- `frontend/src/services`: Axios client and API service wrappers
- `frontend/src/hooks`: stateful auth and appointment hooks
- `frontend/src/utils`: formatting and timezone helpers

## Domain Rules

- Users have role `USER` or `ADMIN`.
- Appointments have status `PENDING`, `CONFIRMED`, or `CANCELLED`.
- Appointments cannot be scheduled in the past.
- Appointments must be within active availability hours for the selected day.
- Active appointments cannot overlap.
- Cancelled appointments do not block availability.
- Users can list and cancel their own appointments.
- Admins can list all appointments and confirm appointments.
- Valid transitions: `PENDING` -> `CONFIRMED`, `PENDING` -> `CANCELLED`, `CONFIRMED` -> `CANCELLED`.

## Commands

Backend:

```bash
cd backend
npm install
npm run migrate
npm run seed
npm run dev
npm test
npm run test:coverage
npm run build
```

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Environment Variables

Backend:

```env
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
PORT=
NODE_ENV=
```

Frontend:

```env
VITE_API_URL=
```

If `VITE_API_URL` is not set, the frontend defaults to `http://localhost:3000/api/v1`.

## Development Guidelines

- Keep backend changes aligned with the existing layered structure: domain, application, infrastructure, interfaces.
- Business rules should live in domain rules or use cases, not directly in controllers.
- Controllers should stay focused on HTTP concerns and response shaping.
- Use repository interfaces from the domain layer for use case dependencies.
- Validate API inputs with Zod schemas in `backend/src/interfaces/schemas`.
- Keep frontend API access inside `frontend/src/services`.
- Keep shared or route-level stateful frontend workflows inside hooks.
- Preserve the API response envelope: `status`, `code`, `message`, `data`, `timestamp`.
- Add or update focused tests when changing domain rules, use cases, repositories, or authentication behavior.

## Known Risks

- Time handling mixes UTC backend rules with frontend local timezone conversion.
- JWT configuration must provide a strong `JWT_SECRET` outside local development.
- Backend and frontend validation schemas are duplicated, so API contract changes should update both sides.
- There is no root-level orchestration for backend, frontend, and database startup.
