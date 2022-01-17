import { NextFunction, Request, Response } from "express";

import { AuthorizationError } from "errors";

/**
 * Checks if a refresh token has been passed with the request and passes it along to
 * the next handler
 *
 * @param req The incoming request object
 * @param res The express response object
 * @param next The `next` function used to move on to the next middleware
 */
const getRefreshToken: (req: Request, res: Response, next: NextFunction) => void = (
    req,
    res,
    next
) => {
    const { refresh } = req.cookies;

    if (!refresh) return next(new AuthorizationError("Refresh token missing"));

    res.locals.refresh = refresh;

    return next();
};

export default getRefreshToken;
export { getRefreshToken };
