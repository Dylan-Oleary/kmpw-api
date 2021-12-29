import { isValueOfType } from "@theonlydevsever/utilities";
import { NextFunction, Request, Response } from "express";

import { BadRequestError } from "errors";

/**
 * Validates the request body values passed to user authentication routes
 *
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 * @returns `next`
 */
export const validateUserAuthRequestBody = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    for (const { key, value } of [
        { key: "email", value: email },
        { key: "password", value: password }
    ]) {
        if (!isValueOfType(value, "string")) {
            return next(
                new BadRequestError("Incorrect parameter type", [
                    `Expected string for '${key}' but received: ${typeof value}`
                ])
            );
        }
    }

    next();
};
