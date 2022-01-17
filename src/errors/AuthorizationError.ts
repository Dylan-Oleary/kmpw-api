import { BaseError } from "./BaseError";
import { DefinedErrorCodes, ErrorCode, ErrorDetails, ErrorStatus } from "errors";

class AuthorizationError extends BaseError {
    statusCode: ErrorStatus = ErrorStatus.Unauthorized;
    errorCode: ErrorCode = "KMPW0014";
    details: ErrorDetails = [];

    constructor(
        public message: string = DefinedErrorCodes.KMPW0014,
        public errorDetails: ErrorDetails | string[] = []
    ) {
        super(message);
        this.details = super.serializeErrors(errorDetails);

        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}

export default AuthorizationError;
export { AuthorizationError };
