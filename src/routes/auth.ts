import { UserIdentityProvider } from "@prisma/client";
import { isValueOfType } from "@theonlydevsever/utilities";
import { NextFunction, Request, Response, Router } from "express";

import { BadRequestError, NotAllowedError } from "errors";
import { UserService } from "services";

const authRouter = Router({ caseSensitive: true });

const validateCredentialsRequestBody = (req: Request, res: Response, next: NextFunction) => {
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

authRouter
    .route("/login")
    .post(validateCredentialsRequestBody, (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        return new UserService()
            .authenticateUser(email, password)
            .then((user) => res.status(200).json(user))
            .catch(next);
    })
    .get((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .patch((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .put((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .delete((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()));

authRouter
    .route("/register")
    .post(validateCredentialsRequestBody, (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        return new UserService()
            .createUser({
                email: email.trim(),
                password: password.trim(),
                identityProvider: UserIdentityProvider.LOCAL
            })
            .then((user) => res.status(201).json(user))
            .catch(next);
    })
    .get((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .patch((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .put((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .delete((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()));

export default authRouter;
export { authRouter };
