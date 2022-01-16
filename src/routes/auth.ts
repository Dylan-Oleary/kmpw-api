import { UserIdentityProvider } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";

import { NotAllowedError } from "errors";
import { getRefreshToken, validateUserAuthRequestBody, verifyAccessToken } from "middlewares";
import { AuthorizationService, SessionService, UserService } from "services";

const authRouter = Router({ caseSensitive: true });

authRouter
    .route("/login")
    .post(validateUserAuthRequestBody, (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        const auth = new AuthorizationService();

        return new UserService()
            .authenticateUser(email, password)
            .then((user) => auth.generateTokenSetFromUser(user))
            .then(([accessToken, refreshToken]) => {
                res.cookie("refresh", refreshToken, {
                    expires: new Date(auth.getTokenExpiry(refreshToken) * 1000),
                    httpOnly: process?.env?.NODE_ENV === "production",
                    path: "/auth/refresh"
                });

                return res.status(200).json({ accessToken });
            })
            .catch(next);
    })
    .get((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .patch((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .put((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .delete((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()));

authRouter
    .route("/logout")
    .post(verifyAccessToken, (req: Request, res: Response, next: NextFunction) => {
        const { tokenClaims } = res.locals;

        return new SessionService()
            .addSessionToBlacklist(
                tokenClaims.sid,
                new AuthorizationService().getRefreshTokenLifespan()
            )
            .then(() => {
                res.locals = {};
                res.cookie("refresh", "", {
                    expires: new Date(0),
                    httpOnly: process?.env?.NODE_ENV === "production",
                    path: "/auth/refresh"
                });

                return res.status(200).send("Successfully logged out");
            })
            .catch(next);
    })
    .get((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .patch((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .put((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .delete((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()));

authRouter
    .route("/refresh")
    .get(getRefreshToken, (req: Request, res: Response, next: NextFunction) => {
        const { refresh } = res.locals;
        const auth = new AuthorizationService();

        return auth
            .generateTokenSetFromRefreshToken(refresh)
            .then(([accessToken, refreshToken]) => {
                res.cookie("refresh", refreshToken, {
                    expires: new Date(auth.getTokenExpiry(refreshToken) * 1000),
                    httpOnly: process?.env?.NODE_ENV === "production",
                    path: "/auth/refresh"
                });

                return res.status(200).json({ accessToken });
            })
            .catch(next);
    })
    .patch((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .post((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
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
