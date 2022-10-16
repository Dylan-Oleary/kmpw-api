type ErrorCode = keyof typeof DefinedErrorCodes;

type ErrorDetails = { message: string; field?: string }[];

enum ErrorStatus {
    "BadRequest" = 400,
    "Unauthorized" = 401,
    "NotFound" = 404,
    "NotAllowed" = 405,
    "Conflict" = 409,
    "ExpectationFailed" = 417,
    "UnprocessableEntity" = 422,
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
    KMPW0008: "Invalid query parameter passed",
    KMPW0009: "Validation Error",
    KMPW0010: "Token generation error",
    KMPW0011: "Authorization header missing",
    KMPW0012: "Invalid token",
    KMPW0013: "Redis error",
    KMPW0014: "Authorization Error",
    KMPW0015: "Invalid create/update data",
    KMPW0016: "Invalid asset upload data",
    KMPW0017: "Asset upload processing error",
    KMPW0018: "Asset deletion error",
    KMPW0019: "Asset moderation error",
    KMPW0020: "User not found error"
};

export default DefinedErrorCodes;
export { DefinedErrorCodes, ErrorCode, ErrorDetails, ErrorStatus };
