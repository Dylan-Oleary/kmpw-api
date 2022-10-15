import axios, { AxiosInstance } from "axios";
import { isValueOfType } from "@theonlydevsever/utilities";

import { BadRequestError } from "errors";
import {
    ICurrentWeather,
    ICurrentWeatherWhere,
    IWeatherAlert,
    IWeatherApiCurrentWeather,
    IWeatherApiResponse,
    WeatherAlertType
} from "types";

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
    private readonly moderateAlertCodes: number[];
    private readonly severeAlertCodes: number[];

    constructor() {
        this.apiKey = process?.env?.WEATHER_API_KEY;
        this.apiBaseUrl = process?.env?.WEATHER_API_BASE_URL;
        this.moderateAlertCodes = this.formatWeatherCodeList(
            process?.env?.WEATHER_API_MODERATE_ALERT_CODES
        );
        this.severeAlertCodes = this.formatWeatherCodeList(
            process?.env?.WEATHER_API_SEVERE_ALERT_CODES
        );
        this.request = axios.create({
            baseURL: this.apiBaseUrl,
            params: { key: this.apiKey }
        });
    }

    /**
     * Converts a comma separated list of weather codes into an array
     *
     * @see [Weather API Codes](https://www.weatherapi.com/docs/weather_conditions.json)
     * @param codeList A comma separated list of numbers used to represent certain weather conditions
     * @returns A list of weather codes
     */
    private formatWeatherCodeList(codeList = ""): number[] {
        return codeList
            .split(",")
            .map((code) => parseInt(code?.trim()))
            .filter((code) => !isNaN(code));
    }

    /**
     * Fetches real-time weather data for a location based on the passed parameters
     *
     * @param opts The options to pass when fetching the current weather
     * @returns The found location and its real-time weather data
     */
    public getCurrentWeather(opts: ICurrentWeatherWhere): Promise<ICurrentWeather> {
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
            .get<IWeatherApiResponse>("/current.json", {
                params: { aqi: aqi ? "yes" : "no", q }
            })
            .then(({ data }) => ({ ...data, alert: this.getWeatherAlert(data?.current) }));
    }

    /**
     * Determines if the type of weather alert that should be returned (if at all) based on the
     * specified codes injected into the application
     *
     * @param weather The `current` property on the weather response served by the Weather API
     * @returns A weather alert, if necessary
     */
    public getWeatherAlert(weather: IWeatherApiCurrentWeather): IWeatherAlert {
        const { condition, temp_f } = weather;
        const { code } = condition;

        if (temp_f >= 68) {
            return { condition, recommendedSafetyLevel: 3, type: WeatherAlertType.MODERATE };
        }

        if (!isValueOfType(code, "number")) {
            return;
        }

        const alertData = [
            {
                alertCodes: this.moderateAlertCodes,
                recommendedSafetyLevel: 3,
                type: WeatherAlertType.MODERATE
            },
            {
                alertCodes: this.severeAlertCodes,
                recommendedSafetyLevel: 5,
                type: WeatherAlertType.SEVERE
            }
        ];

        for (const { alertCodes = [], recommendedSafetyLevel, type } of alertData) {
            const matchingCode = alertCodes?.find((alertCode) => alertCode === code);

            if (matchingCode) {
                return { condition, recommendedSafetyLevel, type };
            }
        }

        return;
    }
}

export default WeatherApiService;
export { WeatherApiService };
