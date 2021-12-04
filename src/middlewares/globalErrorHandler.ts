import { Response } from "express";

import { DefinedErrorCodes, ErrorCode, ErrorDetails, ErrorStatus } from "errors";
import { BaseError } from "errors/BaseError";

type ReturnableError = {
    details: ErrorDetails;
    errorCode: ErrorCode;
    message: string;
    status: ErrorStatus;
};

/**
 * Global error handler for the express application
 *
 * @param error The error thrown by the application
 * @param res The express response object
 * @returns The express response object and a JSON object with error information
 */
const globalErrorHandler: (error: Error, res: Response) => Response<ReturnableError> = (
    error,
    res
) => {
    const message = error?.message || DefinedErrorCodes.KMPW0000;
    let status = ErrorStatus.ServerError;
    let details: ErrorDetails = [];
    let errorCode: ErrorCode = "KMPW0000";

    if (error instanceof BaseError) {
        status = error?.statusCode || ErrorStatus.ServerError;
        details = error?.details || [];
        errorCode = error?.errorCode || "KMPW0000";
    }

    return res.status(status).json({
        status,
        message,
        errorCode,
        details
    });
};

export default globalErrorHandler;
export { globalErrorHandler };
