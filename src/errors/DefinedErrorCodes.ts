type ErrorCode = keyof typeof DefinedErrorCodes;

type ErrorDetails = { message: string; field?: string }[];

enum ErrorStatus {
    "BadRequest" = 400,
    "Unauthorized" = 401,
    "NotFound" = 404,
    "NotAllowed" = 405,
    "Conflict" = 409,
    "ExpectationFailed" = 417,
    "ServerError" = 500
}

const DefinedErrorCodes = {
    KMPW0000: "Undefined Error",
    KMPW0001: "Bad Request Error",
    KMPW0002: "Authentication Error",
    KMPW0003: "Not Found Error",
    KMPW0004: "Not Allowed Error",
    KMPW0005: "Conflict Error",
    KMPW0006: "Expectation Failed Error",
    KMPW0007: "Internal Server Error",
    KMPW0008: "Invalid query parameter passed"
};

export default DefinedErrorCodes;
export { DefinedErrorCodes, ErrorCode, ErrorDetails, ErrorStatus };
