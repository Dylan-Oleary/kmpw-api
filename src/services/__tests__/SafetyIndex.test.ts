import { SafetyIndexService } from "../index";

describe("Safety Index Service", () => {
    const getRandomIndex = (arr) => Math.floor(Math.random() * arr.length);

    describe("getters", () => {
        describe("safetyIndex", () => {
            const service = new SafetyIndexService();

            test("returns the correct 'safetyIndex' property", () => {
                expect(service.safetyIndex).toEqual(1);
            });
        }); // close describe("safetyIndex")

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

        describe("safetyIndex", () => {
            const service = new SafetyIndexService();

            test("sets the correct value", () => {
                //@ts-ignore - Accessing private setter
                service.safetyIndex = 10;

                expect(service.safetyIndex).toEqual(10);
            });

            test("sets the value to 0 if a value less than or equal to 0 is passed", () => {
                //@ts-ignore - Accessing private setter
                service.safetyIndex = -10;
                expect(service.safetyIndex).toEqual(0);

                //@ts-ignore - Accessing private setter
                service.safetyIndex = 0;
                expect(service.safetyIndex).toEqual(0);
            });

            test("rounds the index value down if a float is passed", () => {
                //@ts-ignore - Accessing private setter
                service.safetyIndex = 5.44;

                expect(service.safetyIndex).toEqual(5);
            });

            test("throws an error when the passed value is not a number", () => {
                const invalidValues = [true, "test", null, undefined, [1, 2, 3]];

                try {
                    //@ts-ignore - Accessing private setter
                    service.safetyIndex = invalidValues[getRandomIndex(invalidValues)];
                } catch (error) {
                    expect(error).toEqual(
                        expect.objectContaining({
                            details: [],
                            errorCode: "KMPW0009",
                            message: "Safety index must be a number",
                            statusCode: 422
                        })
                    );
                }
            });
        }); // close describe("safetyIndex")

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
}); // close describe("Safety Index Service")
