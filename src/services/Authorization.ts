import { User } from "@prisma/client";
import RedisClient, { Redis } from "ioredis";
import jwt, { JwtPayload } from "jsonwebtoken";
import ms from "ms";
import { nanoid } from "nanoid";

import { DefinedErrorCodes, ServerError } from "errors";
import { AccessToken, IGenerateTokenOptions, RefreshToken } from "types";

class AuthorizationService {
    private redis: Redis;
    private accessTokenSecret: string;
    private accessTokenLifespan: number;
    private refreshTokenSecret: string;
    private refreshTokenLifespan: number;

    constructor() {
        this.redis = new RedisClient(parseInt(process?.env?.REDIS_PORT) || 6379);
        this.accessTokenSecret = process?.env?.ACCESS_TOKEN_SECRET || "access-secret";
        this.accessTokenLifespan = ms(process?.env?.ACCESS_TOKEN_LIFESPAN || "15m");
        this.refreshTokenSecret = process?.env?.REFRESH_TOKEN_SECRET || "refresh-secret";
        this.refreshTokenLifespan = ms(process?.env?.REFRESH_TOKEN_LIFESPAN || "7d");
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

    public generateTokenSetFromUser(user: Partial<User>): Promise<[AccessToken, RefreshToken]> {
        if (!user) {
            return Promise.reject(
                new ServerError(DefinedErrorCodes.KMPW0010, [
                    "Attempting to generate a token set without a valid user"
                ])
            );
        }

        //TODO: Log IP Address of user
        const aud = "kmpw-user";
        const iss = "kmpw-api";
        const sid = nanoid();
        const sub = user.id;

        return Promise.all([
            this.generateToken(
                { aud, exp: this.accessTokenLifespan, iss, sid, sub },
                this.accessTokenSecret
            ),
            this.generateToken(
                { aud, exp: this.refreshTokenLifespan, iss, sid, sub },
                this.refreshTokenSecret
            )
        ]);
    }

    public getTokenExpiry(token: string): number {
        const decoded = jwt.decode(token);

        return (decoded as JwtPayload).exp;
    }
}

export default AuthorizationService;
export { AuthorizationService };
