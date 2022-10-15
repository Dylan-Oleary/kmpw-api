import getDistance from "geolib/es/getDistance";
import { GeolibInputCoordinates } from "geolib/es/types";

import { WeatherApiService, WeatherCacheService } from "services";
import { ICurrentWeather, IGetWeatherOpts } from "types";

class WeatherService {
    private readonly weatherCacheDistance: number;

    constructor() {
        this.weatherCacheDistance = parseInt(process?.env?.WEATHER_CACHE_DISTANCE_METRES || "5000");
    }

    /**
     * Fetches weather data from the Weather API and stores the response in Redis
     *
     * @param opts Options used to fetch and set weather data
     * @param cache An instance of the Redis cache
     * @returns Response data from the Weather API
     */
    public fetchAndCacheWeather(
        opts: IGetWeatherOpts,
        cache: WeatherCacheService
    ): Promise<ICurrentWeather> {
        const { id, location } = opts;

        return new WeatherApiService()
            .getCurrentWeather(location)
            .then((response) =>
                cache.setCachedWeather({ id, value: response }).then(() => response)
            );
    }

    /**
     * Fetches weather data. This data will either be cached or real-time depending on the passed location
     * and Redis data
     *
     * @param opts Options used to fetch weather data
     * @returns Weather response payload (live or cached) from the Weather API
     */
    public async getWeather(opts: IGetWeatherOpts): Promise<ICurrentWeather> {
        try {
            const { id, location } = opts;
            const weatherCache = new WeatherCacheService();
            const cachedWeatherResponse = await weatherCache.getCachedWeather({ id });

            if (cachedWeatherResponse) {
                const [lat, lon] = location.q.split(",");
                const queryCoords: GeolibInputCoordinates = {
                    lat,
                    lon
                };
                const cachedLocationCoords: GeolibInputCoordinates = {
                    lat: cachedWeatherResponse.location.lat,
                    lon: cachedWeatherResponse.location.lon
                };
                const distanceBetweenCoordinates = getDistance(queryCoords, cachedLocationCoords);

                if (distanceBetweenCoordinates <= this.weatherCacheDistance) {
                    return cachedWeatherResponse;
                }
            }

            return this.fetchAndCacheWeather(opts, weatherCache);
        } catch (error) {
            throw error;
        }
    }
}

export default WeatherService;
export { WeatherService };
