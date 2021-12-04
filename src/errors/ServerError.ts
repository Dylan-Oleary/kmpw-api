import { BaseError } from "./BaseError";
import { DefinedErrorCodes, ErrorCode, ErrorDetails, ErrorStatus } from "errors";

class ServerError extends BaseError {
    statusCode: ErrorStatus = ErrorStatus.ServerError;
    errorCode: ErrorCode = "KMPW0007";
    details: ErrorDetails = [];

    constructor(
        public message: string = DefinedErrorCodes.KMPW0007,
        public errorDetails: ErrorDetails | string[] = []
    ) {
        super(message);
        this.details = super.serializeErrors(errorDetails);

        Object.setPrototypeOf(this, ServerError.prototype);
    }
}

export default ServerError;
export { ServerError };
