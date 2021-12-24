import axios, { AxiosInstance } from "axios";
import { isValueOfType } from "@theonlydevsever/utilities";

import { BadRequestError } from "errors";
import { ICurrentWeatherResponse, ICurrentWeatherWhere } from "types";

/**
 * A service used to fetch weather information from [Weather API](https://www.weatherapi.com/)
 *
 * @see [Documentation](https://www.weatherapi.com/docs/)
 * @see [API Playground](https://www.weatherapi.com/api-explorer.aspx)
 */
class WeatherApiService {
    private request: AxiosInstance;
    private readonly apiKey: string;
    private readonly apiBaseUrl: string;

    constructor() {
        this.apiKey = process?.env?.WEATHER_API_KEY;
        this.apiBaseUrl = process?.env?.WEATHER_API_BASE_URL;
        this.request = axios.create({
            baseURL: this.apiBaseUrl,
            params: { key: this.apiKey }
        });
    }

    /**
     * Fetches real-time weather data for a location based on the passed parameters
     *
     * @param opts The options to pass when fetching the current weather
     * @returns The found location and its real-time weather data
     */
    getCurrentWeather(opts: ICurrentWeatherWhere): Promise<ICurrentWeatherResponse> {
        const { q = "", aqi = false } = opts;

        if (!isValueOfType(q, "string")) {
            return Promise.reject(
                new BadRequestError("Incorrect parameter type", [
                    `Expected 'string' but got ${typeof q}`
                ]).setErrorCode("KMPW0008")
            );
        }
        if (q.trim().length === 0) {
            return Promise.reject(
                new BadRequestError("Query parameter cannot be empty").setErrorCode("KMPW0008")
            );
        }

        return this.request
            .get("/current.json", { params: { aqi: aqi ? "yes" : "no", q } })
            .then(({ data }) => data);
    }
}

export default WeatherApiService;
export { WeatherApiService };
