import { BaseError } from "./BaseError";
import { DefinedErrorCodes, ErrorCode, ErrorDetails, ErrorStatus } from "errors";

class ExpectationFailedError extends BaseError {
    statusCode: ErrorStatus = ErrorStatus.ExpectationFailed;
    errorCode: ErrorCode = "KMPW0006";
    details: ErrorDetails = [];

    constructor(
        public message: string = DefinedErrorCodes.KMPW0006,
        public errorDetails: ErrorDetails | string[] = []
    ) {
        super(message);
        this.details = super.serializeErrors(errorDetails);

        Object.setPrototypeOf(this, ExpectationFailedError.prototype);
    }
}

export default ExpectationFailedError;
export { ExpectationFailedError };
