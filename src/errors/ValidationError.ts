import { BaseError } from "./BaseError";
import { DefinedErrorCodes, ErrorCode, ErrorDetails, ErrorStatus } from "errors";

class ValidationError extends BaseError {
    statusCode: ErrorStatus = ErrorStatus.UnprocessableEntity;
    errorCode: ErrorCode = "KMPW0009";
    details: ErrorDetails = [];

    constructor(
        public message: string = DefinedErrorCodes.KMPW0009,
        public errorDetails: ErrorDetails | string[] = []
    ) {
        super(message);
        this.details = super.serializeErrors(errorDetails);

        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export default ValidationError;
export { ValidationError };
