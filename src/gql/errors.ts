import * as Sentry from "@sentry/node";
import { ApolloError } from "apollo-server-express";
import { GraphQLError } from "graphql";

import { ErrorStatus } from "errors";
import BaseError from "errors/BaseError";
import { shouldSendErrorToSentry } from "lib";

export const GraphQLErrorCodeMap = {
    400: "BAD_REQUEST",
    401: "UNAUTHENTICATED",
    404: "NOT_FOUND",
    405: "FORBIDDEN",
    409: "CONFLICT",
    417: "EXPECTATION_FAILED",
    422: "UNPROCESSABLE_ENTITY",
    500: "INTERNAL_SERVER_ERROR"
};

/**
 * Converts regular errors into formatted Apollo Errors that can be reliably returned
 * to a client
 *
 * @param error An error thrown from any source that is not GraphQL
 * @returns A formatted Apollo Error
 */
export const convertErrorToGqlError = (error: BaseError) => {
    const { message, statusCode = ErrorStatus.ServerError } = error;
    const errorData = { exception: { ...error } };

    return new ApolloError(
        message,
        GraphQLErrorCodeMap[statusCode] || GraphQLErrorCodeMap[500],
        errorData
    );
};

/**
 * Formats a GraphQL error to ensure that the Apollo error code matches the correct
 * error status code of the original error thrown by the resolver
 *
 * @param error A GraphQLError
 * @returns A formatted Apollo Error
 */
export const formatGqlError = (error: GraphQLError) => {
    const { extensions } = error;
    const { code, exception } = extensions;
    const { statusCode } = exception as BaseError;

    if (shouldSendErrorToSentry(exception as BaseError)) {
        Sentry.captureException(error, (scope) => {
            scope.setContext("Error Data", exception);

            return scope;
        });
    }

    if (statusCode && GraphQLErrorCodeMap[statusCode] !== code) {
        return {
            ...error,
            extensions: {
                ...extensions,
                code: GraphQLErrorCodeMap[statusCode] || GraphQLErrorCodeMap[500]
            }
        };
    }

    return error;
};
