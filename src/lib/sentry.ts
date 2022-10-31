import { SENTRY_ERROR_CODES, SENTRY_HTTP_CODES } from "config";
import BaseError from "errors/BaseError";

export const shouldSendErrorToSentry: (error: BaseError) => boolean = (error) =>
    SENTRY_HTTP_CODES.indexOf(Number(error?.statusCode)) != -1 ||
    SENTRY_ERROR_CODES.indexOf(error?.errorCode) != -1;
