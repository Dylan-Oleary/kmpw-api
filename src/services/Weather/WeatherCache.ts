import ms from "ms";

import { RedisService } from "services";
import { ICurrentWeatherResponse, IGetCachedWeatherOpts, ISetCachedWeatherOpts } from "types";

class WeatherCacheService extends RedisService {
    private cacheKeyPrefix: string;

    constructor() {
        super({ expiresInSeconds: ms(process?.env?.WEATHER_CACHE_LIFESPAN || "5m") / 1000 });

        this.cacheKeyPrefix = "weather-";
    }

    /**
     * Builds a valid cache key for weather data
     *
     * @param id The id of the entity associated with the desired value
     * @returns A formatted cache key
     */
    private buildCacheKey(id: string): string {
        return `${this.cacheKeyPrefix}${id}`;
    }

    /**
     * Fetches and formats weather data stored in Redis
     *
     * @param opts Options used to fetch the correct data
     * @returns Response payload from the Weather API
     */
    public getCachedWeather(opts: IGetCachedWeatherOpts): Promise<ICurrentWeatherResponse> {
        const { id } = opts;

        return this.getValue(this.buildCacheKey(id)).then((value) => JSON.parse(value));
    }

    /**
     * Formats and sets weather data in Redis
     *
     * @param opts Options used to set the data in Redis
     */
    public setCachedWeather(opts: ISetCachedWeatherOpts): Promise<void> {
        const { id, value } = opts;

        return this.setValue({
            key: this.buildCacheKey(id),
            value: JSON.stringify(value)
        });
    }
}

export default WeatherCacheService;
export { WeatherCacheService };
