import axios, { AxiosInstance } from "axios";
import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";
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

        if (!isValueOfType(q, "string"))
            return Promise.reject(
                new BadRequestError(
                    `Incorrect parameter type: Expected 'string' but got ${typeof q}`
                ).setErrorCode("KMPW0008")
            );
        if (q.trim().length === 0)
            return Promise.reject(
                new BadRequestError("Query parameter cannot be empty").setErrorCode("KMPW0008")
            );

        return this.request
            .get("/current.json", { params: { aqi: aqi ? "yes" : "no", q } })
            .then(({ data }) => data);
    }

    /**
     * Returns the GraphQL type definitions for the Weather API integration
     *
     * @returns The GraphQL type definitions for the Weather API
     */
    public static getGqlTypeDefinitions(): DocumentNode {
        return gql`
            type WeatherLocation {
                country: String
                name: String
                region: String
                lat: Float
                lon: Float
                tz_id: String
                localtime: String
                localtime_epoch: String
            }

            type WeatherCondition {
                code: Int
                icon: String
                text: String
            }

            type AirQuality {
                co: Float
                o3: Float
                no2: Float
                so2: Float
                pm2_5: Float
                pm10: Float
            }

            type CurrentWeather {
                air_quality: AirQuality
                cloud: Int
                condition: WeatherCondition
                feelslike_c: Float
                feelslike_f: Float
                gust_kph: Float
                gust_mph: Float
                humidity: Int
                is_day: Int
                last_updated: String
                last_updated_epoch: Int
                precip_in: Float
                precip_mm: Float
                pressure_in: Float
                pressure_mb: Float
                temp_c: Float
                temp_f: Float
                uv: Float
                wind_degree: Int
                wind_dir: String
                wind_kph: Float
                wind_mph: Float
            }

            input CurrentWeatherWhere {
                q: String!
                aqi: Boolean
            }

            type CurrentWeatherResponse {
                current: CurrentWeather
                location: WeatherLocation
            }

            extend type Query {
                currentWeather(where: CurrentWeatherWhere): CurrentWeatherResponse
            }
        `;
    }

    /**
     * Defines and returns the resolvers for the Weather API integration
     *
     * @returns GraphQL resolvers for the Weather API schema
     */
    public getGqlTypeResolvers() {
        return {
            Query: {
                currentWeather: (_, args) => this.getCurrentWeather({ ...(args?.where || {}) })
            }
        };
    }
}

export default WeatherApiService;
export { WeatherApiService };
