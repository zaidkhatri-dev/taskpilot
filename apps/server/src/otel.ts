// otel.ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";
import { serverConfig } from "@repo/config/server";
// Configure the OTLP Exporter (sends data to Jaeger, Datadog, Grafana, etc.)
// By default, it sends to http://localhost:4318/v1/traces
const traceExporter = new OTLPTraceExporter(); 

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: serverConfig.OTEL_SERVICE_NAME,
    [ATTR_SERVICE_VERSION]: "1.0.0",
  }),
  traceExporter,
  // Automatically instruments Express, HTTP, and common DB drivers
  instrumentations: [getNodeAutoInstrumentations()],
});

// Start the SDK
sdk.start();

const shutDownTelemetry = async () => {
    sdk.shutdown()
    .then(() => {
        console.log("OpenTelemetry SDK shut down successfully");
        process.exit(0);
    })
    .catch((error) =>{
        console.error("Error shutting down OpenTelemetry SDK", error);
        process.exit(1);
    })
}

// Ensure telemetry data is flushed on shutdown
process.on('SIGTERM', shutDownTelemetry);
process.on('SIGINT', shutDownTelemetry);