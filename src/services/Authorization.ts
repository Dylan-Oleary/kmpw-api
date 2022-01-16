import { User } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import ms from "ms";
import { nanoid } from "nanoid";

import { AuthenticationError, DefinedErrorCodes, ServerError } from "errors";
import { SessionService, UserService } from "services";
import { AccessToken, IGenerateTokenOptions, RefreshToken } from "types";

class AuthorizationService {
    private accessTokenSecret: string;
    private accessTokenLifespan: number;
    private refreshTokenSecret: string;
    private refreshTokenLifespan: number;
    private tokenAud: string;
    private tokenIss: string;

    constructor() {
        this.accessTokenSecret = process?.env?.ACCESS_TOKEN_SECRET || "access-secret";
        this.accessTokenLifespan = ms(process?.env?.ACCESS_TOKEN_LIFESPAN || "15m") / 1000;
        this.refreshTokenSecret = process?.env?.REFRESH_TOKEN_SECRET || "refresh-secret";
        this.refreshTokenLifespan = ms(process?.env?.REFRESH_TOKEN_LIFESPAN || "7d") / 1000;
        this.tokenAud = "kmpw-user";
        this.tokenIss = "kmpw-api";
    }

    /**
     * Generates a JSON Web Token based on the passed options
     *
     * @param opts Values to be stored in the token
     * @param secret The secret used to sign the token
     * @returns A JSON Web Token
     */
    public generateToken(opts: IGenerateTokenOptions, secret: string): Promise<AccessToken> {
        return new Promise((resolve, reject) => {
            jwt.sign(opts, secret, (error, token) => {
                if (error) {
                    return reject(
                        new ServerError(DefinedErrorCodes.KMPW0010, [
                            `Error generating token: ${error?.message || error}`
                        ])
                    );
                }

                return resolve(token);
            });
        });
    }

    /**
     * Generates a new access and refresh token derived from the passed refresh token
     *
     * @param token A JSON Web Token
     * @returns An access and refresh token
     */
    public async generateTokenSetFromRefreshToken(
        token: RefreshToken
    ): Promise<[AccessToken, RefreshToken]> {
        if (!token) {
            return Promise.reject(
                new ServerError(DefinedErrorCodes.KMPW0010, [
                    "Attempting to generate a token set without a valid refresh token"
                ])
            );
        }

        // Verify Refresh Token
        const session = new SessionService();
        const tokenClaims = await jwt.verify(
            token,
            this.refreshTokenSecret,
            { audience: this.tokenAud, issuer: this.tokenIss },
            async (error, decoded) => {
                if (error) {
                    try {
                        // If the token can't be verified – blacklist the session
                        const decoded = jwt.decode(token);

                        await session.addSessionToBlacklist(
                            (decoded as JwtPayload)?.sid,
                            this.refreshTokenLifespan
                        );

                        return Promise.reject(
                            new AuthenticationError(DefinedErrorCodes.KMPW0012, [
                                `Error verifying token: ${error?.message || error}`
                            ]).setErrorCode("KMPW0012")
                        );
                    } catch (e) {
                        return Promise.reject(e);
                    }
                }

                try {
                    const { iat, sid, sub } = decoded;
                    const [isSessionBlacklisted, isUserRequiredToReauthenticate] =
                        await Promise.all([
                            session.isSessionBlacklisted(sid),
                            this.isUserRequiredToReauthenticate(sub, iat)
                        ]);

                    // If the session is present in the blacklist – the token is invalid
                    if (isSessionBlacklisted) {
                        return Promise.reject(
                            new AuthenticationError(DefinedErrorCodes.KMPW0012, [
                                "Session no longer exists"
                            ]).setErrorCode("KMPW0012")
                        );
                    }

                    if (isUserRequiredToReauthenticate) {
                        await session.addSessionToBlacklist(sid, this.refreshTokenLifespan);

                        return Promise.reject(
                            new AuthenticationError(DefinedErrorCodes.KMPW0012, [
                                "Session no longer exists"
                            ]).setErrorCode("KMPW0012")
                        );
                    }

                    return decoded;
                } catch (e) {
                    return Promise.reject(e);
                }
            }
        );

        // If the token & session are valid, generate a new token set
        //@ts-ignore - Token Claims Type Error from `jsonwebtoken`
        const { aud, iss, sid, sub } = tokenClaims;
        const tokenOptions = {
            aud,
            iss,
            sid,
            sub
        };

        return Promise.all([
            this.generateToken(
                { ...tokenOptions, exp: Math.floor(Date.now() / 1000) + this.accessTokenLifespan },
                this.accessTokenSecret
            ),
            this.generateToken(
                { ...tokenOptions, exp: Math.floor(Date.now() / 1000) + this.refreshTokenLifespan },
                this.refreshTokenSecret
            )
        ]);
    }

    /**
     * Generates an access and refresh token derived from the passed user
     *
     * @param user The user for which the token set will generated
     * @returns An access and refresh token
     */
    public generateTokenSetFromUser(user: Partial<User>): Promise<[AccessToken, RefreshToken]> {
        if (!user) {
            return Promise.reject(
                new ServerError(DefinedErrorCodes.KMPW0010, [
                    "Attempting to generate a token set without a valid user"
                ])
            );
        }

        const tokenOptions = {
            aud: this.tokenAud,
            iss: this.tokenIss,
            sid: nanoid(),
            sub: user.id
        };

        return Promise.all([
            this.generateToken(
                { ...tokenOptions, exp: Math.floor(Date.now() / 1000) + this.accessTokenLifespan },
                this.accessTokenSecret
            ),
            this.generateToken(
                { ...tokenOptions, exp: Math.floor(Date.now() / 1000) + this.refreshTokenLifespan },
                this.refreshTokenSecret
            )
        ]);
    }

    /**
     * Returns the number of seconds a refresh token is valid for
     *
     * @returns The lifespan of the refresh token in seconds
     */
    public getRefreshTokenLifespan(): number {
        return this.refreshTokenLifespan;
    }

    /**
     * Decodes the passed token and returns a `NumericDate` value
     *
     * `NumericDate` is defined as the number of seconds since Epoch
     *
     * @param token A JSON Web Token
     * @returns The `NumericDate` the token expires
     */
    public getTokenExpiry(token: string): number {
        const decoded = jwt.decode(token);

        return (decoded as JwtPayload).exp;
    }

    /**
     * Verifies whether or not the user must re-authenticate based on the passed timestamp
     *
     * @param id The user id
     * @param tokenIssuedAt The `iat` (seconds since Epoch) property of a JSON Web Token – This is the timestamp of the date the token was issued
     * @returns `true` if the user's `reauthenticationAt` value is later than the date the token was issued
     */
    private isUserRequiredToReauthenticate(id: string, tokenIssuedAt: number): Promise<boolean> {
        return new UserService().getUser({ id }).then((user) => {
            const { reauthenticationAt } = user;

            if (!reauthenticationAt) return false;

            return Math.floor(reauthenticationAt.getTime() / 1000) > tokenIssuedAt;
        });
    }

    /**
     * Verifies the passed access token and returns the extracted payload
     *
     * @param token A JSON Web Token
     * @returns The decoded token payload
     */
    public verifyAccessToken(token: string): Promise<JwtPayload> {
        return new Promise((resolve, reject) => {
            jwt.verify(
                token,
                this.accessTokenSecret,
                { audience: this.tokenAud, issuer: this.tokenIss },
                async (error, decoded) => {
                    if (error) {
                        return reject(
                            new AuthenticationError(DefinedErrorCodes.KMPW0012, [
                                `Error verifying token: ${error?.message || error}`
                            ]).setErrorCode("KMPW0012")
                        );
                    }

                    try {
                        const session = new SessionService();
                        const { iat, sid, sub } = decoded;
                        const [isSessionBlacklisted, isUserRequiredToReauthenticate] =
                            await Promise.all([
                                session.isSessionBlacklisted(sid),
                                this.isUserRequiredToReauthenticate(sub, iat)
                            ]);

                        // If the session is present in the blacklist – the token is invalid
                        if (isSessionBlacklisted) {
                            return reject(
                                new AuthenticationError(DefinedErrorCodes.KMPW0012, [
                                    "Session no longer exists"
                                ]).setErrorCode("KMPW0012")
                            );
                        }

                        if (isUserRequiredToReauthenticate) {
                            await session.addSessionToBlacklist(sid, this.refreshTokenLifespan);

                            return reject(
                                new AuthenticationError(DefinedErrorCodes.KMPW0012, [
                                    "Session no longer exists"
                                ]).setErrorCode("KMPW0012")
                            );
                        }

                        return resolve(decoded);
                    } catch (e) {
                        return reject(e);
                    }
                }
            );
        });
    }
}

export default AuthorizationService;
export { AuthorizationService };
