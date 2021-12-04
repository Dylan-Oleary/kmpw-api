import { NextFunction, Request, Response } from "express";
import request from "supertest";

import { DefinedErrorCodes, NotFoundError } from "errors";
import { catchAllHandler } from "middlewares";
import { initializeApplication } from "root/application";

describe("catchAllHandler", () => {
    const application = initializeApplication();

    test("returns a 404 error when the route does not exist", () =>
        request(application).get("/idonotexist").expect(404));

    test("calls the 'next' function with the correct error", () => {
        const mockNextFunction: Partial<NextFunction> = jest.fn();

        catchAllHandler(
            { params: {} } as Request,
            {} as Response,
            mockNextFunction as NextFunction
        );

        expect(mockNextFunction)
            .toBeCalledWith(
                new NotFoundError(DefinedErrorCodes.KMPW0003, [
                    "The requested resource could not be found or does not exist"
                ])
            )
            .toBeCalledTimes(1);
    });

    test("calls the 'next' function with the correct error details", () => {
        const mockNextFunction: Partial<NextFunction> = jest.fn();

        catchAllHandler(
            //@ts-ignore
            { params: { "0": "/watch/out" } } as Request,
            {} as Response,
            mockNextFunction as NextFunction
        );

        expect(mockNextFunction)
            .toBeCalledWith(
                new NotFoundError(DefinedErrorCodes.KMPW0003, ["/watch/out does not exist"])
            )
            .toBeCalledTimes(1);
    });
}); // close describe("catchAllHandler")
