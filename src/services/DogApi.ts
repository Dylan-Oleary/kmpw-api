import { Breed } from "@prisma/client";
import { capitalize, isValueOfType } from "@theonlydevsever/utilities";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import convert from "convert-units";

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
     * Builds a label and value from a passed string
     *
     * @param attr A string
     * @returns A label and value built from the passed attribute value
     */
    public buildAttributeLabelAndValue(attr: string): { label: string; value: string } {
        const value = attr
            ?.split(" ")
            ?.filter((v) => v.trim().length > 0 && v.trim().toLowerCase() !== "and")
            ?.join("-")
            ?.replace(/['"]+/g, "")
            ?.toLowerCase();
        const label = capitalize(
            attr
                ?.split(" ")
                ?.filter((v) => v.trim().length > 0 && v.trim().toLowerCase() !== "and")
                ?.join(" ")
                ?.replace(/['"]+/g, "")
                ?.toLowerCase()
        );

        return { label, value };
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
                } else if (value?.["imperial"]) {
                    const metricKeyPrefix = `${key}Metric`;
                    const imperialKeyPrefix = `${key}Imperial`;
                    const {
                        avg: imperialAvg,
                        min: imperialMin,
                        max: imperialMax
                    } = this.formatSingleBreedMeasurement(value["imperial"]);

                    const conversionFrom = key === "weight" ? "lb" : "in";
                    const conversionTo = key === "weight" ? "kg" : "cm";
                    const convertedMin = convert(imperialMin).from(conversionFrom).to(conversionTo);
                    const convertedMax = convert(imperialMax).from(conversionFrom).to(conversionTo);
                    const {
                        avg: metricAvg,
                        min: metricMin,
                        max: metricMax
                    } = this.formatSingleBreedMeasurement(`${convertedMin} - ${convertedMax}`);

                    measurementsToAdd = {
                        ...measurementsToAdd,
                        [`${imperialKeyPrefix}Min`]: imperialMin,
                        [`${imperialKeyPrefix}Max`]: imperialMax,
                        [`${imperialKeyPrefix}Avg`]: imperialAvg,
                        [`${metricKeyPrefix}Min`]: metricMin,
                        [`${metricKeyPrefix}Max`]: metricMax,
                        [`${metricKeyPrefix}Avg`]: metricAvg
                    };
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
                const min = Number(splitValue[0].toFixed(1));
                const max = Number((splitValue[1] || min).toFixed(1));
                const avg = Number(((min + max) / 2).toFixed(1));

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
