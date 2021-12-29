import { UserIdentityProvider } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";

import { NotAllowedError } from "errors";
import { validateUserAuthRequestBody } from "middlewares/auth";
import { UserService } from "services";

const authRouter = Router({ caseSensitive: true });

authRouter
    .route("/login")
    .post(validateUserAuthRequestBody, (req: Request, res: Response, next: NextFunction) => {
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
    .post(validateUserAuthRequestBody, (req: Request, res: Response, next: NextFunction) => {
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
