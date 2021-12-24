import { SafetyIndexService } from "../index";

describe("Safety Index Service", () => {
    const getRandomIndex = (arr) => Math.floor(Math.random() * arr.length);

    describe("constructor", () => {
        test("throws an error when an invalid temperature option is passed", () => {
            try {
                const invalidValues = [true, "test", null, undefined, [1, 2, 3]];
                new SafetyIndexService({
                    //@ts-ignore - Setting an invalid value
                    temperatureFarenheit: invalidValues[getRandomIndex(invalidValues)]
                });
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
    }); // close describe("constructor")

    describe("getters", () => {
        describe("safetyIndex", () => {
            const service = new SafetyIndexService({ temperatureFarenheit: 50 });

            test("returns the correct 'safetyIndex' property", () => {
                expect(service.safetyIndex).toEqual(1);
            });
        }); // close describe("safetyIndex")

        describe("temperatureFarenheit", () => {
            const temperatureFarenheit = 22;
            const service = new SafetyIndexService({ temperatureFarenheit });

            test("returns the correct 'temperatureFarenheit' property", () => {
                expect(service.temperatureFarenheit).toEqual(temperatureFarenheit);
            });
        }); // close describe("temperatureFarenheit")
    }); // close describe("getters")

    describe("setters", () => {
        describe("safetyIndex", () => {
            const service = new SafetyIndexService({ temperatureFarenheit: 50 });

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
            const service = new SafetyIndexService({ temperatureFarenheit: 50 });

            test("sets the correct value", () => {
                //@ts-ignore - Accessing private setter
                service.temperatureFarenheit = 66;

                expect(service.temperatureFarenheit).toEqual(66);
            });

            test("sets the value to -100 if the passed value is less than -100", () => {
                //@ts-ignore - Accessing private setter
                service.temperatureFarenheit = -499;

                expect(service.temperatureFarenheit).toEqual(-100);
            });

            test("throws an error when the value passed is not a number", () => {
                const invalidValues = [true, "test", null, undefined, [1, 2, 3]];

                try {
                    //@ts-ignore - Accessing private setter
                    service.temperatureFarenheit = invalidValues[getRandomIndex(invalidValues)];
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
        }); // close describe("temperatureFarenheit")
    }); // close describe("setters")
}); // close describe("Safety Index Service")
