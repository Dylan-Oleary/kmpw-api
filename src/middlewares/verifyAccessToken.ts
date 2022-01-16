import { NextFunction, Request, Response } from "express";

import { AuthenticationError } from "errors";
import { AuthorizationService } from "services";

/**
 * Checks if an access token has been passed with the request headers and passes it along to
 * the next handler
 *
 * @param req The incoming request object
 * @param res The express response object
 * @param next The `next` function used to move on to the next middleware
 */
const verifyAccessToken: (req: Request, res: Response, next: NextFunction) => void = (
    req,
    res,
    next
) => {
    const authorization = req?.headers?.authorization;

    if (!authorization) {
        return next(
            new AuthenticationError("Authorization header missing from request").setErrorCode(
                "KMPW0011"
            )
        );
    }

    const accessToken = authorization?.split(" ")?.[1]?.trim();

    if (!accessToken) {
        return next(
            new AuthenticationError("Access token missing from request").setErrorCode("KMPW0011")
        );
    }

    return new AuthorizationService()
        .verifyAccessToken(accessToken)
        .then((tokenClaims) => {
            res.locals.tokenClaims = tokenClaims;

            return next();
        })
        .catch(next);
};

export default verifyAccessToken;
export { verifyAccessToken };
