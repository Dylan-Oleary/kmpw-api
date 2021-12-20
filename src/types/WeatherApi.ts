export interface IWeatherLocation {
    /**
     * The country of the location
     */
    country: string;
    /**
     * The name of the location
     */
    name: string;
    /**
     * Region or state of the location, if available
     */
    region?: string;
    /**
     * Latitude of the location – in decimal degree
     */
    lat: number;
    /**
     * Longitude of the location – in decimal degree
     */
    lon: number;
    /**
     * The timezone name
     */
    tz_id?: string;
    /**
     * The local date and time
     */
    localtime?: string;
    /**
     * Local date and time in UNIX time
     */
    localtime_epoch?: string;
}

export interface ICurrentWeather {
    /**
     * Local time when the real time data was updated
     */
    last_updated: string;
    /**
     * Local time when the real time data was updated in UNIX time
     */
    last_updated_epoch: number;
    /**
     * Temperature in celsius
     */
    temp_c: number;
    /**
     * Temperature in farenheit
     */
    temp_f: number;
    /**
     * Feels like temperature in celsius
     */
    feelslike_c: number;
    /**
     * Feels like temperature in fahrenheit
     */
    feelslike_f: number;
    /**
     * Weather condition information
     */
    condition: {
        /**
         * Unique weather condition code
         */
        code: number;
        /**
         * Weather icon url
         */
        icon: string;
        /**
         * Weather condition text
         */
        text: string;
    };
    /**
     * Wind speed in miles per hour
     */
    wind_mph: number;
    /**
     * Wind speed in kilometer per hour
     */
    wind_kph: number;
    /**
     * Wind direction in degrees
     */
    wind_degree: number;
    /**
     * Wind direction as 16 point compass. e.g.: NSW
     */
    wind_dir: string;
    /**
     * Pressure in millibars
     */
    pressure_mb: number;
    /**
     * Pressure in inches
     */
    pressure_in: number;
    /**
     * Precipitation amount in millimeters
     */
    precip_mm: number;
    /**
     * Precipitation amount in inches
     */
    precip_in: number;
    /**
     * Humidity as percentage
     */
    humidity: number;
    /**
     * Cloud cover as percentage
     */
    cloud: number;
    /**
     * Is it day time?
     */
    is_day: number;
    /**
     * 	UV Index
     */
    uv: number;
    /**
     * Wind gust in miles per hour
     */
    gust_mph: number;
    /**
     * Wind gust in kilometer per hour
     */
    gust_kph: number;
    /**
     * The current air quality
     */
    air_quality?: IWeatherAirQuality;
}

export interface IWeatherAirQuality {
    /**
     * Carbon Monoxide (μg/m3)
     */
    co: number;
    /**
     * Ozone (μg/m3)
     */
    o3: number;
    /**
     * Nitrogen dioxide (μg/m3)
     */
    no2: number;
    /**
     * Sulphur dioxide (μg/m3)
     */
    so2: number;
    /**
     * PM2.5 (μg/m3)
     */
    pm2_5: number;
    /**
     * PM10 (μg/m3
     */
    pm10: number;
}

export interface ICurrentWeatherWhere {
    /**
     * Whether or not to include air quality data
     */
    aqi?: boolean;
    /**
     * The query string passed to the request
     */
    q: string;
}

export interface ICurrentWeatherResponse {
    /**
     * The current weather from the matching location
     */
    current: ICurrentWeather;
    /**
     * The matching location matched from the request parameters
     */
    location: IWeatherLocation;
}
