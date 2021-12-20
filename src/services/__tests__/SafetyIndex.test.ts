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
    }); // close describe("getters")

    describe("setters", () => {
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
                    expect(error.message).toEqual("Safety index must be a number");
                }
            });
        }); // close describe("safetyIndex")
    }); // close describe("setters")
}); // close describe("Safety Index Service")
