import RedisClient, { Redis } from "ioredis";

import { ServerError } from "errors";
import { IRedisServiceConstructorOpts, ISetCacheValueOpts } from "types";

abstract class RedisService {
    private redis: Redis;
    private defaultExpiresInSeconds: number;

    constructor(opts: IRedisServiceConstructorOpts) {
        const { expiresInSeconds } = opts;

        this.redis = new RedisClient({ host: process?.env?.REDIS_HOST || "localhost" });
        this.defaultExpiresInSeconds = expiresInSeconds;
    }

    /**
     * Fetches a value from the Redis cache
     *
     * @param key The key used to fetch a value in Redis
     * @returns The value associated with the passed key
     */
    protected getValue(key: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.redis.get(key, (error, response) => {
                if (error) {
                    return reject(
                        new ServerError("Redis Error", [
                            error?.message ||
                                `An error occurred while attempting to get a value in Redis`,
                            `Value to get: ${key}`
                        ]).setErrorCode("KMPW0013")
                    );
                }

                return resolve(response);
            });
        });
    }

    /**
     * Sets a value in Redis based on the passed options
     *
     * @param opts Options to apply when setting a value in Redis
     */
    protected setValue(opts: ISetCacheValueOpts): Promise<void> {
        const { expriesInSeconds = this.defaultExpiresInSeconds, key, value } = opts;

        return new Promise((resolve, reject) => {
            this.redis.setex(key, expriesInSeconds, value, (error) => {
                if (error) {
                    return reject(
                        new ServerError("Redis Error", [
                            error?.message ||
                                `An error occurred while attempting to set a value in Redis`,
                            `Value to set: ${key}`
                        ]).setErrorCode("KMPW0013")
                    );
                }

                return resolve();
            });
        });
    }
}

export default RedisService;
export { RedisService };
