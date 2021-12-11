import { Breed } from "@prisma/client";
import { capitalize, isValueOfType } from "@theonlydevsever/utilities";
import axios, { AxiosInstance, AxiosResponse } from "axios";

import { IDogApiBreed, IDogApiGetBreedsParams } from "types";

class DogApiService {
    private request: AxiosInstance;
    private readonly apiKey: string;
    private readonly apiBaseUrl: string;

    constructor() {
        this.apiKey = process?.env?.DOG_API_KEY;
        this.apiBaseUrl = process?.env?.DOG_API_BASE_URL;
        this.request = axios.create({
            baseURL: this.apiBaseUrl,
            headers: { ["x-api-key"]: this.apiKey }
        });
    }

    /**
     * Formats height, weight, & life span measurements from the Dog API to an object
     * that matches the `Breed` model in Prisma
     *
     * @param breed A breed record from the Dog API
     * @returns An object containing formatted breed measurements that match the Prisma schema
     */
    public formatBreedMeasurements(breed: IDogApiBreed): Partial<Breed> {
        const { height, life_span, weight } = breed;
        const measurementData = [
            {
                key: "height",
                value: height
            },
            {
                key: "weight",
                value: weight
            },
            {
                key: "lifeSpan",
                value: life_span
            }
        ];
        let formattedMeasurements: Partial<Breed> = {};

        for (const { key, value } of measurementData) {
            if (value) {
                let measurementsToAdd: Partial<Breed> = {};

                if (key === "lifeSpan") {
                    const {
                        avg: lifeSpanAvg,
                        min: lifeSpanMin,
                        max: lifeSpanMax
                    } = this.formatSingleBreedMeasurement(value as string);

                    measurementsToAdd = {
                        ...measurementsToAdd,
                        lifeSpanAvg,
                        lifeSpanMin,
                        lifeSpanMax
                    };
                } else {
                    for (const unit of ["imperial", "metric"]) {
                        if (value?.[unit]) {
                            const objKeyPrefix = `${key}${capitalize(unit)}`;
                            const { avg, min, max } = this.formatSingleBreedMeasurement(
                                value[unit]
                            );

                            measurementsToAdd = {
                                ...measurementsToAdd,
                                [`${objKeyPrefix}Min`]: min,
                                [`${objKeyPrefix}Max`]: max,
                                [`${objKeyPrefix}Avg`]: avg
                            };
                        }
                    }
                }

                formattedMeasurements = {
                    ...formattedMeasurements,
                    ...measurementsToAdd
                };
            }
        }

        return formattedMeasurements;
    }

    /**
     * Returns the maximum, minimum, & average value of the measurement
     *
     * @example
     * ```
     * "10 - 20 years" => { avg: 15, min: 10, max: 20}
     * ```
     *
     * @param measurement A single measurement string
     * @returns An object containing the maximum, minimum, & average value of the measurement
     */
    public formatSingleBreedMeasurement(measurement: string): {
        min?: number;
        max?: number;
        avg?: number;
    } {
        if (isValueOfType(measurement, "string")) {
            const splitValue = measurement
                ?.replace("-", " ")
                ?.split(" ")
                ?.filter((v) => !isNaN(parseFloat(v)))
                ?.map((v) => parseFloat(v));

            if (splitValue?.length > 0) {
                const min = splitValue[0];
                const max = splitValue[1] || min;
                const avg = (min + max) / 2;

                return { avg, max, min };
            }

            return {};
        }

        return {};
    }

    /**
     * Returns the breed group that the breed belongs to.
     *
     * @param breed A breed record from the Dog API
     * @returns The breed group that the breed belongs to or 'Other' if no breed group exists
     */
    public getBreedGroupFromBreed(breed: IDogApiBreed): string {
        const { breed_group } = breed;

        return !breed_group || breed_group?.trim().length === 0 ? "Other" : breed_group;
    }

    /**
     * Requests breed records from the Dog API
     *
     * @param requestParams The request parameters used in the request
     * @returns An array of breed records from the Dog API
     */
    public getBreeds(requestParams: IDogApiGetBreedsParams = {}): Promise<IDogApiBreed[]> {
        const params = { ...requestParams };
        const requestKeys = Object.keys(requestParams);
        const validKeys = ["page", "limit"];

        for (const key of requestKeys) {
            if (validKeys.indexOf(key) === -1) delete requestParams[key];
        }

        return this.request
            .get<IDogApiBreed, AxiosResponse<IDogApiBreed[]>>("/breeds", { params })
            .then(({ data = [] }) => data);
    }
}

export default DogApiService;
export { DogApiService };
