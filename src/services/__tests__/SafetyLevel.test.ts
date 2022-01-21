import { WeightClass } from "@prisma/client";

import { SafetyLevelService } from "../index";
import { SafetyLevelModel } from "../../types";

describe("Safety Level Service", () => {
    const getRandomIndex = (arr) => Math.floor(Math.random() * arr.length);
    const testDogs = [
        {
            id: "small-guy",
            weightClass: WeightClass.SMALL,
            weightImperial: 12,
            coldSafetyLevelOneFarenheitTemp: 55,
            coldSafetyLevelTwoFarenheitTemp: 45,
            coldSafetyLevelThreeFarenheitTemp: 30,
            coldSafetyLevelFourFarenheitTemp: 25,
            coldSafetyLevelFiveFarenheitTemp: 0
        },
        {
            id: "medium-guy",
            weightClass: WeightClass.MEDIUM,
            weightImperial: 40.5,
            coldSafetyLevelOneFarenheitTemp: 50,
            coldSafetyLevelTwoFarenheitTemp: 45,
            coldSafetyLevelThreeFarenheitTemp: 30,
            coldSafetyLevelFourFarenheitTemp: 15,
            coldSafetyLevelFiveFarenheitTemp: 0
        },
        {
            id: "large-guy",
            weightClass: WeightClass.LARGE,
            weightImperial: 78,
            coldSafetyLevelOneFarenheitTemp: 45,
            coldSafetyLevelTwoFarenheitTemp: 40,
            coldSafetyLevelThreeFarenheitTemp: 20,
            coldSafetyLevelFourFarenheitTemp: 15,
            coldSafetyLevelFiveFarenheitTemp: 0
        }
    ];

    describe("buildDogSizeWhere", () => {
        const service = new SafetyLevelService();

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

    describe("calculateSafetyLevel", () => {
        test("sets the safety level to 5 when the temperature is less than 0", () => {
            const service = new SafetyLevelService();

            //@ts-ignore - Overriding instance variable
            service._temperatureFarenheit = -100;
            service.calculateSafetyLevel();

            //@ts-ignore - Accessing private variable
            expect(service._safetyLevel).toEqual(5);
        });

        test("returns the service", () => {
            //@ts-ignore - Accessing private function
            const service = new SafetyLevelService();

            service.setTemperature(20);
            //@ts-ignore - Overriding instance variable
            service._dog = testDogs[0];

            const serviceReturned = service.calculateSafetyLevel();

            expect(serviceReturned).toBeInstanceOf(SafetyLevelService);
        });
    }); // close describe("calculateSafetyLevel")

    describe("setDog", () => {
        test("throws an error if the passed data is not an object", () => {
            const service = new SafetyLevelService();
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
            const service = new SafetyLevelService();

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
            const service = new SafetyLevelService();

            return service
                .setDog({
                    id: "abc123",
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
            const service = new SafetyLevelService();

            return service
                .setDog(
                    {
                        id: "abc123",
                        weightImperial: 50
                    },
                    //@ts-ignore - Passing invalid model
                    "PEOPLE"
                )
                .catch((error) => {
                    expect(error).toEqual(
                        expect.objectContaining({
                            details: [
                                {
                                    message: `Model must be one of ${Object.entries(
                                        SafetyLevelModel
                                    )
                                        .map(([, v]) => `'${v}'`)
                                        .join(", ")}`
                                }
                            ],
                            errorCode: "KMPW0009",
                            message: "Invalid model",
                            statusCode: 422
                        })
                    );
                });
        });
    }); // close describe("setDog")

    describe("setSafetyLevel", () => {
        test("sets the correct value", () => {
            const service = new SafetyLevelService();
            //@ts-ignore - Accessing private function
            service.setSafetyLevel(2);

            //@ts-ignore - Accessing private variable
            expect(service._safetyLevel).toEqual(2);
        });

        test("returns the service", () => {
            //@ts-ignore - Accessing private function
            const serviceReturned = new SafetyLevelService().setSafetyLevel(2);

            expect(serviceReturned).toBeInstanceOf(SafetyLevelService);
        });

        test("sets the value to 1 if the passed value is less than 1", () => {
            const service = new SafetyLevelService();
            //@ts-ignore - Accessing private function
            service.setSafetyLevel(-77);

            //@ts-ignore - Accessing private variable
            expect(service._safetyLevel).toEqual(1);
        });

        test("rounds the passed value down if a float is passed", () => {
            const service = new SafetyLevelService();
            //@ts-ignore - Accessing private function
            service.setSafetyLevel(2.6);

            //@ts-ignore - Accessing private variable
            expect(service._safetyLevel).toEqual(2);
        });

        test("throws an error if the passed value is not a number", () => {
            const service = new SafetyLevelService();
            const invalidValues = [true, "test", null, undefined, [1, 2, 3]];

            try {
                //@ts-ignore - Passing invalid value
                service.setSafetyLevel(invalidValues[getRandomIndex(invalidValues)]);
            } catch (error) {
                expect(error).toEqual(
                    expect.objectContaining({
                        details: [],
                        errorCode: "KMPW0009",
                        message: "Safety level must be a number",
                        statusCode: 422
                    })
                );
            }
        });
    }); // close describe("setSafetyLevel")

    describe("setTemperature", () => {
        test("sets the correct value", () => {
            const service = new SafetyLevelService();
            service.setTemperature(50);

            //@ts-ignore - Accessing private variable
            expect(service._temperatureFarenheit).toEqual(50);
        });

        test("returns the service", () => {
            const serviceReturned = new SafetyLevelService().setTemperature(20);

            expect(serviceReturned).toBeInstanceOf(SafetyLevelService);
        });

        test("sets the value to -100 if the passed value is less than -100", () => {
            const service = new SafetyLevelService();
            service.setTemperature(-200);

            //@ts-ignore - Accessing private variable
            expect(service._temperatureFarenheit).toEqual(-100);
        });

        test("throws an error if the passed value is not a number", () => {
            const service = new SafetyLevelService();
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
    }); // close describe("setTemperature")
}); // close describe("Safety Level Service")
