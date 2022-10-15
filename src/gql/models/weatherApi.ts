import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";

import { WeatherApiService } from "services";

export type CurrentWeatherWhere = {
    q: string;
    aqi?: boolean;
};

export const typeDefinitions: DocumentNode = gql`
    enum WeatherAlertType {
        MODERATE
        SEVERE
    }

    type WeatherAlert {
        condition: WeatherCondition
        recommendedSafetyLevel: Int
        type: WeatherAlertType
    }

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
        alert: WeatherAlert
        current: CurrentWeather
        location: WeatherLocation
    }

    extend type Query {
        currentWeather(where: CurrentWeatherWhere): CurrentWeatherResponse
    }
`;

export const resolvers = {
    Query: {
        currentWeather: (_, args) =>
            new WeatherApiService().getCurrentWeather({ ...(args?.where || {}) })
    }
};
