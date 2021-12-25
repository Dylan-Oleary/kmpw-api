import { WeightClass } from "@prisma/client";

import { SafetyIndexService } from "../index";

describe("Safety Index Service", () => {
    const getRandomIndex = (arr) => Math.floor(Math.random() * arr.length);

    describe("getters", () => {
        describe("temperatureFarenheit", () => {
            const service = new SafetyIndexService().setTemperature(10);

            test("returns the correct 'temperatureFarenheit' property", () => {
                expect(service.temperatureFarenheit).toEqual(10);
            });
        });
    }); // close describe("getters")

    describe("setters", () => {
        describe("dog", () => {
            test("throws an error if the passed data is not an object", () => {
                const service = new SafetyIndexService();
                const invalidValues = [true, "test", null, undefined, [1, 2, 3]];

                return (
                    service
                        //@ts-ignore - Passing invalid value
                        .setDog(invalidValues[getRandomIndex(invalidValues)])
                        .catch((error) => {
                            expect(error).toEqual(
                                expect.objectContaining({
                                    details: [],
                                    errorCode: "KMPW0009",
                                    message: "Dog data must be an object",
                                    statusCode: 422
                                })
                            );
                        })
                );
            });

            test("throws an error if the passed id is not a string", () => {
                const service = new SafetyIndexService();

                return service
                    .setDog({
                        //@ts-ignore - Passing invalid value
                        id: 905
                    })
                    .catch((error) => {
                        expect(error).toEqual(
                            expect.objectContaining({
                                details: [],
                                errorCode: "KMPW0009",
                                message: "Dog ID must be a string",
                                statusCode: 422
                            })
                        );
                    });
            });

            test("throws an error if the passed weight is less than 0", () => {
                const service = new SafetyIndexService();

                return service
                    .setDog({
                        id: "abc123",
                        model: "Breed",
                        weightImperial: -100
                    })
                    .catch((error) => {
                        expect(error).toEqual(
                            expect.objectContaining({
                                details: [],
                                errorCode: "KMPW0009",
                                message: "Weight cannot be less than 0",
                                statusCode: 422
                            })
                        );
                    });
            });

            test("throws an error if the passed model is invalid", () => {
                const service = new SafetyIndexService();

                return service
                    .setDog({
                        id: "abc123",
                        //@ts-ignore - Passing invalid value
                        model: "People",
                        weightImperial: 50
                    })
                    .catch((error) => {
                        expect(error).toEqual(
                            expect.objectContaining({
                                details: [],
                                errorCode: "KMPW0009",
                                message: "Invalid model passed",
                                statusCode: 422
                            })
                        );
                    });
            });
        }); // close describe("dog")

        describe("temperatureFarenheit", () => {
            test("sets the correct value", () => {
                const service = new SafetyIndexService();
                service.setTemperature(50);

                expect(service.temperatureFarenheit).toEqual(50);
            });

            test("returns the service", () => {
                const serviceReturned = new SafetyIndexService().setTemperature(20);

                expect(serviceReturned).toBeInstanceOf(SafetyIndexService);
            });

            test("sets the value to -100 if the passed value is less than -100", () => {
                const service = new SafetyIndexService();
                service.setTemperature(-200);

                expect(service.temperatureFarenheit).toEqual(-100);
            });

            test("throws an error if the passed value is not a number", () => {
                const service = new SafetyIndexService();
                const invalidValues = [true, "test", null, undefined, [1, 2, 3]];

                try {
                    //@ts-ignore - Passing invalid value
                    service.setTemperature(invalidValues[getRandomIndex(invalidValues)]);
                } catch (error) {
                    expect(error).toEqual(
                        expect.objectContaining({
                            details: [],
                            errorCode: "KMPW0009",
                            message: "Temperature must be a number",
                            statusCode: 422
                        })
                    );
                }
            });
        });
    }); // close describe("setters")

    describe("buildDogSizeWhere", () => {
        const service = new SafetyIndexService();

        test("returns the correct value when the passed value is greater than 99", () => {
            //@ts-ignore - Testing private function
            const where = service.buildDogSizeWhere(120);

            expect(where).toEqual(
                expect.objectContaining({
                    weightClass: { equals: WeightClass.LARGE }
                })
            );
        });

        test("returns the correct value when the passed value is less than 99", () => {
            const weightImperial = 58;
            //@ts-ignore - Testing private function
            const where = service.buildDogSizeWhere(weightImperial);

            expect(where).toEqual(
                expect.objectContaining({
                    weightImperialMax: { gte: weightImperial },
                    weightImperialMin: { lte: weightImperial }
                })
            );
        });
    }); // close describe("buildDogSizeWhere")
}); // close describe("Safety Index Service")
