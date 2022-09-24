import { ICurrentWeatherResponse } from "types";

export interface IGetCachedWeatherOpts {
    /**
     * The id of the entity associated to the weather response
     */
    id: string;
}

export interface ISetCachedWeatherOpts {
    /**
     * The id of the entity associated to the weather response
     */
    id: string;
    /**
     * The weather response to be cached
     */
    value: ICurrentWeatherResponse;
}
