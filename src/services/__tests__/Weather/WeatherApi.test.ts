import { WeatherApiService } from "../../Weather";

describe("Weather API Service", () => {
    const getRandomIndex = (arr) => Math.floor(Math.random() * arr.length);

    describe("getCurrentWeather", () => {
        test("throws an error when the 'q' parameter is not a string", () => {
            const service = new WeatherApiService();
            const invalidValues = [0, false, null, { id: 1 }];
            const q = invalidValues[getRandomIndex(invalidValues)];

            return (
                service
                    //@ts-ignore - Passing incorrect 'q' parameter
                    .getCurrentWeather({ q })
                    .then(() => {
                        throw new Error("Expected an error to be thrown");
                    })
                    .catch((error) => {
                        expect(error).toEqual(
                            expect.objectContaining({
                                details: [
                                    {
                                        message: `Expected 'string' but got ${typeof q}`
                                    }
                                ],
                                errorCode: "KMPW0008",
                                message: "Incorrect parameter type",
                                statusCode: 400
                            })
                        );
                    })
            );
        });

        test("throws an error when the 'q' parameter is an empty string", () => {
            const service = new WeatherApiService();

            return service
                .getCurrentWeather({ q: " " })
                .then(() => {
                    throw new Error("Expected an error to be thrown");
                })
                .catch((error) => {
                    expect(error).toEqual(
                        expect.objectContaining({
                            details: [],
                            errorCode: "KMPW0008",
                            message: "Query parameter cannot be empty",
                            statusCode: 400
                        })
                    );
                });
        });
    }); // close describe("getCurrentWeather")
}); // close describe("Weather API Service")
