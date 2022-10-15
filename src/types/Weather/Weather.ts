import { ICurrentWeatherWhere, IWeatherApiCondition } from "types";

export interface IGetWeatherOpts {
    /**
     * The id of the entity associated to the weather response
     */
    id: string;
    /**
     * Location query data to be sent to the Weather API
     */
    location: ICurrentWeatherWhere;
}

export interface IWeatherAlert {
    condition: IWeatherApiCondition;
    recommendedSafetyLevel: number;
    type: WeatherAlertType;
}

export enum WeatherAlertType {
    MODERATE = "MODERATE",
    SEVERE = "SEVERE"
}
