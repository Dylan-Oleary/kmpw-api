import * as Sentry from "@sentry/node";
import { AuthenticationError } from "apollo-server-express";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { AuthorizationError } from "errors";
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
            new AuthorizationError("Authorization header missing from request").setErrorCode(
                "KMPW0011"
            )
        );
    }

    const accessToken = authorization?.split(" ")?.[1]?.trim();

    if (!accessToken) {
        return next(
            new AuthorizationError("Access token missing from request").setErrorCode("KMPW0011")
        );
    }

    return new AuthorizationService()
        .verifyAccessToken(accessToken)
        .then((tokenClaims) => {
            res.locals.tokenClaims = tokenClaims;

            Sentry.setUser({ id: tokenClaims?.sub });

            return next();
        })
        .catch(next);
};

/**
 * Verifies the authorization header attached to the GraphQL request
 *
 * @param req The express request object passed in by Apollo
 * @returns An access token payload
 */
const verifyAccessTokenGraphQL: (req: Request) => Promise<JwtPayload> = (req) => {
    const authorization = req?.headers?.authorization;

    if (!authorization) {
        throw new AuthenticationError("Authorization header missing from request");
    }

    const accessToken = authorization?.split(" ")?.[1]?.trim();

    if (!accessToken) {
        throw new AuthenticationError("Access token missing from request");
    }

    return new AuthorizationService().verifyAccessToken(accessToken).then((tokenClaims) => {
        Sentry.setUser({ id: tokenClaims?.sub });

        return tokenClaims;
    });
};

export default verifyAccessToken;
export { verifyAccessToken, verifyAccessTokenGraphQL };
