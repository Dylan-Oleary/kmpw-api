import { ModelService } from "..";
import { DefinedErrorCodes, ErrorStatus, ValidationError } from "../../errors";
import { IServiceField } from "../../types";

class DummyService extends ModelService {
    readonly modelFields: IServiceField[] = [
        this.generateServiceField({
            name: "name",
            isRequiredOnCreate: false,
            type: "string",
            validation: async (value) => {
                if (value?.trim()?.length === 0)
                    throw new ValidationError(DefinedErrorCodes.KMPW0015, [
                        "name cannot be empty"
                    ]).setErrorCode("KMPW0015");
                if (value?.trim().length > 50)
                    throw new ValidationError(DefinedErrorCodes.KMPW0015, [
                        "name cannot be more than 50 characters"
                    ]).setErrorCode("KMPW0015");
            }
        }),
        this.generateServiceField({
            name: "isCoolAsHeck",
            isRequiredOnCreate: false,
            type: "boolean"
        }),
        this.generateServiceField({
            name: "numOfMarioGames",
            isRequiredOnCreate: false,
            type: "number"
        }),
        this.generateServiceField({
            name: "noCreate",
            canCreate: false,
            isRequiredOnCreate: false,
            type: "string"
        }),
        this.generateServiceField({
            name: "requiredOnCreate",
            type: "string"
        }),
        this.generateServiceField({
            name: "noUpdate",
            canEdit: false,
            isRequiredOnCreate: false,
            type: "string"
        })
    ];

    constructor() {
        super();
    }
}

describe("Model Service", () => {
    const getRandomIndex = (arr) => Math.floor(Math.random() * arr.length);
    const dummy = new DummyService();

    describe("validateCreateData", () => {
        test("throws an error if a passed field that cannot be created", () => {
            const key = "noCreate";

            return dummy
                .validateCreateData({ [key]: "w00t!", requiredOnCreate: "blah" })
                .then(() => {
                    throw new Error("Expected an error to be thrown");
                })
                .catch((error) => {
                    expect(error).toEqual(
                        expect.objectContaining({
                            details: [{ message: `${key} is not allowed on create` }],
                            errorCode: "KMPW0015",
                            message: DefinedErrorCodes.KMPW0015,
                            statusCode: ErrorStatus.UnprocessableEntity
                        })
                    );
                    expect(error instanceof ValidationError).toEqual(true);
                });
        });

        test("throws an error if the passed field fails validation", async () => {
            const key = "name";
            const minLengthFail = "";
            const maxLengthFail = "BTBAM".repeat(20);

            await dummy
                .validateCreateData({ [key]: minLengthFail, requiredOnCreate: "blah" })
                .then(() => {
                    throw new Error("Expected an error to be thrown");
                })
                .catch((error) => {
                    expect(error).toEqual(
                        expect.objectContaining({
                            details: [{ message: `${key} cannot be empty` }],
                            errorCode: "KMPW0015",
                            message: DefinedErrorCodes.KMPW0015,
                            statusCode: ErrorStatus.UnprocessableEntity
                        })
                    );
                    expect(error instanceof ValidationError).toEqual(true);
                });

            await dummy
                .validateCreateData({ [key]: maxLengthFail, requiredOnCreate: "blah" })
                .then(() => {
                    throw new Error("Expected an error to be thrown");
                })
                .catch((error) => {
                    expect(error).toEqual(
                        expect.objectContaining({
                            details: [{ message: `${key} cannot be more than 50 characters` }],
                            errorCode: "KMPW0015",
                            message: DefinedErrorCodes.KMPW0015,
                            statusCode: ErrorStatus.UnprocessableEntity
                        })
                    );
                    expect(error instanceof ValidationError).toEqual(true);
                });
        });

        test("throws an error if the passed field is required but not present in the data", () => {
            const key = "requiredOnCreate";

            return dummy
                .validateCreateData({ name: "hello-test" })
                .then(() => {
                    throw new Error("Expected an error to be thrown");
                })
                .catch((error) => {
                    expect(error).toEqual(
                        expect.objectContaining({
                            details: [{ message: `${key} is required on create` }],
                            errorCode: "KMPW0015",
                            message: DefinedErrorCodes.KMPW0015,
                            statusCode: ErrorStatus.UnprocessableEntity
                        })
                    );
                    expect(error instanceof ValidationError).toEqual(true);
                });
        });

        test("throws an error if the passed field is required but an empty string is passed", () => {
            const key = "requiredOnCreate";

            return dummy
                .validateCreateData({ name: "hello-test", requiredOnCreate: "" })
                .then(() => {
                    throw new Error("Expected an error to be thrown");
                })
                .catch((error) => {
                    expect(error).toEqual(
                        expect.objectContaining({
                            details: [{ message: `${key} is required on create` }],
                            errorCode: "KMPW0015",
                            message: DefinedErrorCodes.KMPW0015,
                            statusCode: ErrorStatus.UnprocessableEntity
                        })
                    );
                    expect(error instanceof ValidationError).toEqual(true);
                });
        });

        test("throws an error if the passed field is required but 'null' is passed", () => {
            const key = "requiredOnCreate";

            return dummy
                .validateCreateData({ name: "hello-test", requiredOnCreate: null })
                .then(() => {
                    throw new Error("Expected an error to be thrown");
                })
                .catch((error) => {
                    expect(error).toEqual(
                        expect.objectContaining({
                            details: [{ message: `${key} is required on create` }],
                            errorCode: "KMPW0015",
                            message: DefinedErrorCodes.KMPW0015,
                            statusCode: ErrorStatus.UnprocessableEntity
                        })
                    );
                    expect(error instanceof ValidationError).toEqual(true);
                });
        });

        test("throws an error if the passed field is required but 'undefined' is passed", () => {
            const key = "requiredOnCreate";

            return dummy
                .validateCreateData({ name: "hello-test", requiredOnCreate: undefined })
                .then(() => {
                    throw new Error("Expected an error to be thrown");
                })
                .catch((error) => {
                    expect(error).toEqual(
                        expect.objectContaining({
                            details: [{ message: `${key} is required on create` }],
                            errorCode: "KMPW0015",
                            message: DefinedErrorCodes.KMPW0015,
                            statusCode: ErrorStatus.UnprocessableEntity
                        })
                    );
                    expect(error instanceof ValidationError).toEqual(true);
                });
        });

        describe("Type Validation", () => {
            test("throws an error if the passed field value should be a boolean, but is not", () => {
                const inValidValues = ["supercoolstring", null, 123, new Date()];
                const invalidValue = inValidValues[getRandomIndex(inValidValues)];
                const { name, type } = dummy.modelFields.find(({ type }) => type === "boolean");

                return dummy
                    .validateCreateData({ [name]: invalidValue, requiredOnCreate: "blah" })
                    .then(() => {
                        throw new Error("Expected an error to be thrown");
                    })
                    .catch((error) => {
                        expect(error).toEqual(
                            expect.objectContaining({
                                details: [
                                    {
                                        message: `Expected ${name} to be of type ${type}, but received ${typeof invalidValue}`
                                    }
                                ],
                                errorCode: "KMPW0015",
                                message: DefinedErrorCodes.KMPW0015,
                                statusCode: ErrorStatus.UnprocessableEntity
                            })
                        );
                        expect(error instanceof ValidationError).toEqual(true);
                    });
            });

            test("throws an error if the passed field value should be a number, but is not", () => {
                const inValidValues = ["supercoolstring", null, true, new Date()];
                const invalidValue = inValidValues[getRandomIndex(inValidValues)];
                const { name, type } = dummy.modelFields.find(({ type }) => type === "number");

                return dummy
                    .validateCreateData({ [name]: invalidValue, requiredOnCreate: "blah" })
                    .then(() => {
                        throw new Error("Expected an error to be thrown");
                    })
                    .catch((error) => {
                        expect(error).toEqual(
                            expect.objectContaining({
                                details: [
                                    {
                                        message: `Expected ${name} to be of type ${type}, but received ${typeof invalidValue}`
                                    }
                                ],
                                errorCode: "KMPW0015",
                                message: DefinedErrorCodes.KMPW0015,
                                statusCode: ErrorStatus.UnprocessableEntity
                            })
                        );
                        expect(error instanceof ValidationError).toEqual(true);
                    });
            });

            test("throws an error if the passed field value should be a string, but is not", () => {
                const inValidValues = [true, null, 123, new Date()];
                const invalidValue = inValidValues[getRandomIndex(inValidValues)];
                const { name, type } = dummy.modelFields.find(({ type }) => type === "string");

                return dummy
                    .validateCreateData({ [name]: invalidValue, requiredOnCreate: "blah" })
                    .then(() => {
                        throw new Error("Expected an error to be thrown");
                    })
                    .catch((error) => {
                        expect(error).toEqual(
                            expect.objectContaining({
                                details: [
                                    {
                                        message: `Expected ${name} to be of type ${type}, but received ${typeof invalidValue}`
                                    }
                                ],
                                errorCode: "KMPW0015",
                                message: DefinedErrorCodes.KMPW0015,
                                statusCode: ErrorStatus.UnprocessableEntity
                            })
                        );
                        expect(error instanceof ValidationError).toEqual(true);
                    });
            });
        }); // close describe("Type Validation")
    }); // close describe("validateCreateData")

    describe("validateUpdateData", () => {
        test("throws an error if a passed field that cannot be updated", () => {
            const key = "noUpdate";

            return dummy
                .validateUpdateData({ [key]: "w00t!", requiredOnCreate: "blah" })
                .then(() => {
                    throw new Error("Expected an error to be thrown");
                })
                .catch((error) => {
                    expect(error).toEqual(
                        expect.objectContaining({
                            details: [{ message: `${key} is not allowed on edit` }],
                            errorCode: "KMPW0015",
                            message: DefinedErrorCodes.KMPW0015,
                            statusCode: ErrorStatus.UnprocessableEntity
                        })
                    );
                    expect(error instanceof ValidationError).toEqual(true);
                });
        });

        test("throws an error if the passed field fails validation", async () => {
            const key = "name";
            const minLengthFail = "";
            const maxLengthFail = "BTBAM".repeat(20);

            await dummy
                .validateUpdateData({ [key]: minLengthFail, requiredOnCreate: "blah" })
                .then(() => {
                    throw new Error("Expected an error to be thrown");
                })
                .catch((error) => {
                    expect(error).toEqual(
                        expect.objectContaining({
                            details: [{ message: `${key} cannot be empty` }],
                            errorCode: "KMPW0015",
                            message: DefinedErrorCodes.KMPW0015,
                            statusCode: ErrorStatus.UnprocessableEntity
                        })
                    );
                    expect(error instanceof ValidationError).toEqual(true);
                });

            await dummy
                .validateUpdateData({ [key]: maxLengthFail, requiredOnCreate: "blah" })
                .then(() => {
                    throw new Error("Expected an error to be thrown");
                })
                .catch((error) => {
                    expect(error).toEqual(
                        expect.objectContaining({
                            details: [{ message: `${key} cannot be more than 50 characters` }],
                            errorCode: "KMPW0015",
                            message: DefinedErrorCodes.KMPW0015,
                            statusCode: ErrorStatus.UnprocessableEntity
                        })
                    );
                    expect(error instanceof ValidationError).toEqual(true);
                });
        });
    }); // close describe("validateUpdateDta")
}); // close describe("Model Service")
