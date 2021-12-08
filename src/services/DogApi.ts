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
     * Requests breed records from the Dog API
     *
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
