import { NextFunction, Request, Response, Router } from "express";

import { NotAllowedError } from "errors";
import { AuthorizationService, CloudinaryService, SessionService, UserService } from "services";

const userRouter: Router = Router({ caseSensitive: true });

userRouter
    .route("/")
    .get((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .post((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .patch((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .put((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .delete((req: Request, res: Response, next: NextFunction) => {
        const { tokenClaims } = res?.locals;

        return new UserService()
            .deleteUser(tokenClaims?.sub)
            .then(() =>
                new SessionService().addSessionToBlacklist(
                    tokenClaims?.sid,
                    new AuthorizationService().getRefreshTokenLifespan()
                )
            )
            .then(() => new CloudinaryService().deleteUserImages(tokenClaims?.sub))
            .then(() => {
                res.locals = {};
                return res.sendStatus(204);
            })
            .catch(next);
    });

export default userRouter;
export { userRouter };
