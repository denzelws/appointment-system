# SigNoz Documentation Notes

These notes were collected while setting up a local SigNoz environment and instrumenting a Fastify + TypeScript backend with OpenTelemetry. The goal is to identify documentation points that could be improved for new contributors or developers integrating SigNoz into a Node.js backend.

## Context

- Backend: Fastify + TypeScript
- Database: PostgreSQL
- Observability: OpenTelemetry + SigNoz
- Local SigNoz setup: Docker Compose
- Telemetry endpoint: OTLP HTTP on port `4318`

## Confusing or Slower Documentation Points

### 1. Self-hosted setup vs contributor development setup

It was not immediately obvious that running SigNoz locally with Docker Compose is different from setting up the SigNoz codebase for product development or contribution.

```text
If you want to observe your own application locally, use the self-hosted Docker setup.
If you want to contribute to SigNoz itself, use the development setup.
```

### 2. Docker Compose location

Docker Compose must be executed from the correct directory:

```bash
cd deploy/docker
docker compose up -d --remove-orphans
```

Running Docker Compose from the wrong folder can make the setup feel broken even when Docker itself is working.

### 3. UI port vs telemetry ingestion port

These ports serve different purposes:

| Port   | Purpose                       |
| ------ | ----------------------------- |
| `8080` | SigNoz web UI                 |
| `4318` | OTLP HTTP telemetry ingestion |
| `4317` | OTLP gRPC telemetry ingestion |

Confusing the UI port with the collector ingestion port is easy for beginners.

### 4. Fastify instrumentation guidance

Some OpenTelemetry examples reference deprecated Fastify instrumentation packages, which can create confusion.

A modern Fastify-specific example using `@fastify/otel` would help. The Fastify OpenTelemetry plugin should also be registered early in the application lifecycle.

### 5. Import order for telemetry initialization

OpenTelemetry should be initialized before importing or building the instrumented application modules.

```ts
import "dotenv/config";
import "../telemetry";

import { buildApp } from "../infrastructure/app";
```

```text
Initialize OpenTelemetry before importing your HTTP framework, database client, or application routes.
```

### 6. HTTP method and response status visibility

Traces may appear while method, status, or route details are still unclear.

```text
If traces are appearing but method/status/route are missing, check:
- HTTP framework instrumentation
- plugin registration order
- span attributes
- whether the active request span is being updated
```

### 7. Logs and traces correlation

Logs can appear in SigNoz without being correlated to traces if they are emitted outside an active request or span.

This startup log may not have trace context:

```ts
console.log("OpenTelemetry started");
```

Request-scoped logs are better for validating correlation:

```ts
request.log.info(
  {
    event: "appointment_created",
  },
  "Appointment created successfully",
);
```

### 8. Understanding what successful correlation looks like

A populated `trace_id` proves that a log can be connected to a distributed trace.

```json
{
  "body": "Appointment created successfully",
  "trace_id": "abc123...",
  "span_id": "def456..."
}
```

## Possible Documentation Contribution Ideas

### Option 1 - Add a local app instrumentation guide for Fastify

A short guide showing how to instrument a Fastify backend with:

- OpenTelemetry
- SigNoz local Docker setup
- OTLP HTTP exporter
- request logs
- log-to-trace correlation

### Option 2 - Improve setup explanation around ports

Add a clearer table explaining:

- UI port
- OTLP HTTP port
- OTLP gRPC port

### Option 3 - Add troubleshooting note for missing trace correlation

Add a note explaining why some logs have empty `trace_id` / `span_id`.

### Option 4 - Add clarification between self-hosting and contributing

Add a decision path for developers who are not sure whether they need the self-hosted setup or the contributor development setup.

## Shortlist

```text
1. Difference between self-hosted setup and contributor development setup
2. UI port 8080 vs OTLP ingestion ports 4318/4317
3. Fastify instrumentation path and deprecated package confusion
4. Log-to-trace correlation requiring active request/span context
```
