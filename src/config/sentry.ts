import { NodeOptions } from "@sentry/node";

import { ErrorCode } from "errors";

export const SENTRY_CONFIG: NodeOptions = {
    debug: process?.env?.NODE_ENV === "development",
    dsn: process?.env?.SENTRY_DSN || "",
    enabled: Boolean(parseInt(process?.env?.SENTRY_ENABLED)),
    environment: process?.env?.NODE_ENV,
    release: process?.env?.npm_package_version,
    tracesSampleRate: parseFloat(process?.env?.SENTRY_SAMPLE_RATE || "0.1")
};

export const SENTRY_ERROR_CODES: ErrorCode[] = [
    "KMPW0000",
    "KMPW0010",
    "KMPW0013",
    "KMPW0019",
    "KMPW0021"
];
export const SENTRY_HTTP_CODES: number[] = [500];
