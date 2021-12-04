import { Response } from "express";

import { DefinedErrorCodes, ErrorStatus } from "errors";
import { globalErrorHandler } from "middlewares";

describe("globalErrorHandler", () => {
    const mockResponse: Partial<Response> = {};

    beforeEach(() => {
        mockResponse.status = jest.fn().mockReturnValue(mockResponse);
        mockResponse.json = jest.fn().mockReturnValue(mockResponse);
    });

    test("returns the expected error message when no message is provided", () => {
        //@ts-ignore - Intentionally not passing 'message' as a property
        globalErrorHandler({ name: "Error" }, mockResponse);

        expect(mockResponse.json).toBeCalledWith(
            expect.objectContaining({ message: DefinedErrorCodes.KMPW0000 })
        );
    });

    test("returns the expected error message when a message is provided", () => {
        const expectedMessage = "There's always tomorrow and tomorrow and tomorrow";

        globalErrorHandler(new Error(expectedMessage), mockResponse as Response);

        expect(mockResponse.json).toBeCalledWith(
            expect.objectContaining({ message: expectedMessage })
        );
    });

    test("returns the correct status code when a generic error is passed", () => {
        globalErrorHandler(new Error("I broke it, sorry"), mockResponse as Response);

        expect(mockResponse.status).toBeCalledWith(ErrorStatus.ServerError);
    });

    test("returns the correct error code when a generic error is passed", () => {
        globalErrorHandler(new Error("It's still broken, sorry"), mockResponse as Response);

        expect(mockResponse.json).toBeCalledWith(
            expect.objectContaining({ errorCode: "KMPW0000" })
        );
    });
}); // close describe("globalErrorHandler")
