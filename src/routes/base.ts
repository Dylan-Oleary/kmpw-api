import { NextFunction, Request, Response, Router } from "express";

import { NotAllowedError } from "errors";

const baseRouter: Router = Router({ caseSensitive: true });

baseRouter
    .route("/")
    .get((req: Request, res: Response) => res.status(200).send("Ping!"))
    .post((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .patch((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .put((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .delete((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()));

export default baseRouter;
export { baseRouter };
