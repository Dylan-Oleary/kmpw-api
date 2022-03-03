import RedisClient, { Redis } from "ioredis";

import { ServerError } from "errors";

/**
 * A service used to manage sessions in Redis
 *
 * @see [Redis](https://redis.io/)
 */
class SessionService {
    private redis: Redis;
    private keyPrefix: string;

    constructor() {
        this.redis = new RedisClient({ host: process?.env?.REDIS_HOST || "localhost" });
        this.keyPrefix = "session-";
    }

    /**
     * Adds the passed session to the Redis cache
     *
     * @param id The session id to add to blacklist
     * @param expiresIn The number of seconds the value is stored in Redis
     */
    public addSessionToBlacklist(id: string, expiresIn: number): Promise<void> {
        const sessionKey = this.buildSessionKey(id);

        return new Promise((resolve, reject) => {
            this.redis.setex(sessionKey, expiresIn, 1, (error) => {
                if (error) {
                    return reject(
                        new ServerError("Redis Error", [
                            error?.message ||
                                `An error occurred while attempting to set a value in Redis`,
                            `Value to set: ${sessionKey}`
                        ]).setErrorCode("KMPW0013")
                    );
                }

                return resolve();
            });
        });
    }

    /**
     * Builds a session key using the passed session id
     *
     * @param id The session id used to build the session key
     * @returns A session key to be used in Redis
     */
    private buildSessionKey(id: string): string {
        return `${this.keyPrefix}${id}`;
    }

    /**
     * Checks if a session is currently blacklisted in Redis
     *
     * @param id The session id to find in Redis
     * @returns `true` if the session exists, `false` if it does not
     */
    public isSessionBlacklisted(id: string): Promise<boolean> {
        const sessionKey = this.buildSessionKey(id);

        return new Promise((resolve, reject) => {
            this.redis.exists(sessionKey, (error, exists) => {
                if (error) {
                    return reject(
                        new ServerError("Redis Error", [
                            error?.message ||
                                `An error occurred while attempting to check a value in Redis`,
                            `Value to fetch: ${sessionKey}`
                        ]).setErrorCode("KMPW0013")
                    );
                }

                return resolve(exists === 1);
            });
        });
    }
}

export default SessionService;
export { SessionService };
