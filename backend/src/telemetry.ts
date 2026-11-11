import FastifyOtelInstrumentation from "@fastify/otel";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

const telemetryEnabled = process.env.OTEL_ENABLED !== "false";

const configuredEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT?.trim();
const otelEndpoint = configuredEndpoint || "http://localhost:4318";

const serviceName = process.env.OTEL_SERVICE_NAME?.trim() || "schedulr-backend";

export const fastifyOtelInstrumentation = new FastifyOtelInstrumentation();

let sdk: NodeSDK | undefined;

if (telemetryEnabled) {
  const traceExporter = new OTLPTraceExporter({
    url: `${otelEndpoint}/v1/traces`,
  });

  const metricExporter = new OTLPMetricExporter({
    url: `${otelEndpoint}/v1/metrics`,
  });

  sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: serviceName,
    }),
    traceExporter,
    metricReader: new PeriodicExportingMetricReader({
      exporter: metricExporter,
    }),
    instrumentations: [getNodeAutoInstrumentations(), fastifyOtelInstrumentation],
  });

  sdk.start();
  console.log(`OpenTelemetry started for ${serviceName}`);
}

process.on("SIGTERM", () => {
  if (!sdk) {
    process.exit(0);
    return;
  }

  sdk
    .shutdown()
    .then(() => console.log("OpenTelemetry terminated"))
    .catch((error) => console.error("Error terminating OpenTelemetry", error))
    .finally(() => process.exit(0));
});
