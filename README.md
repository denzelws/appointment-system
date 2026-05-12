# Appointment System

## Overview

Appointment System is a full-stack scheduling application designed to reduce manual coordination in appointment workflows. It allows users to request available time slots while administrators manage confirmations, visibility, and operational control from a centralized interface.

## Product Vision

The product is designed to reduce back-and-forth scheduling, organize appointments in one place, and separate responsibilities between users and administrators. Users can request and manage their own appointments, while admins can review the full schedule, confirm requests, and keep operational control over availability.

## Main Features

- User registration and login
- JWT authentication
- Appointment creation
- Available slot listing
- User appointment listing
- Appointment cancellation
- Admin appointment listing
- Admin appointment confirmation
- Audit logging for key auth and appointment events

## User Roles

- `USER`: can create appointments, view their own appointments, and cancel their own appointments.
- `ADMIN`: can view all appointments and confirm appointment requests.

## Tech Stack

**Frontend**

- React
- Vite
- TypeScript
- React Router
- Axios
- Tailwind CSS
- React Hook Form
- Zod

**Backend**

- TypeScript
- Fastify
- Knex
- JWT
- bcrypt

**Database**

- PostgreSQL
- `btree_gist` extension for appointment overlap protection

**Testing / Validation**

- Vitest
- Zod

## Architecture

The backend follows a layered structure:

- `domain`: entities, value objects, domain rules, errors, and repository interfaces
- `application`: use cases and DTOs
- `infrastructure`: database access, migrations, seeds, app setup, and services
- `interfaces`: HTTP routes, controllers, middleware, and request schemas

The frontend is organized around:

- `pages`: route-level screens
- `components`: reusable UI and layout components
- `services`: API client and endpoint wrappers
- `hooks`: stateful auth and appointment workflows
- `utils`: formatting and timezone helpers

## Running Locally

### Backend

```bash
cd backend
npm install
npm run migrate
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend

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

### Frontend

```env
VITE_API_URL=
```

If `VITE_API_URL` is not set, the frontend defaults to `http://localhost:3000/api/v1`.

## Tests and Build

### Backend

```bash
npm test
npm run test:coverage
npm run build
```

### Frontend

```bash
npm run lint
npm run build
```

## Project Highlights

- Clean separation of responsibilities across backend layers
- Fastify API with structured controllers, schemas, and middleware
- Domain rules isolated from the HTTP layer
- Role-based access control for users and admins
- PostgreSQL-level appointment overlap protection
- Zod validation for API input handling
- JWT-based authentication
- Backend test coverage for core business behavior

## Repository Structure

```text
backend/
frontend/
AGENTS.md
README.md
```
