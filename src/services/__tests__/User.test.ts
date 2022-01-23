import { UserIdentityProvider } from "@prisma/client";

import { UserService } from "..";
import { DefinedErrorCodes, ErrorStatus, ValidationError } from "../../errors";
import { ICreateUserData } from "../../types";

describe("User Service", () => {
    describe("Field Validation", () => {
        describe("email", () => {
            test("throws an error when the passed value is an empty string", () => {
                const data: ICreateUserData = {
                    email: "",
                    password: "hey",
                    identityProvider: UserIdentityProvider.LOCAL
                };

                return new UserService()
                    .createUser(data)
                    .then(() => {
                        throw new Error("Expected an error to be thrown");
                    })
                    .catch((error) => {
                        expect(error).toEqual(
                            expect.objectContaining({
                                details: [{ message: "email is required on create" }],
                                errorCode: "KMPW0015",
                                message: DefinedErrorCodes.KMPW0015,
                                statusCode: ErrorStatus.UnprocessableEntity
                            })
                        );
                        expect(error instanceof ValidationError).toEqual(true);
                    });
            });

            test("throws an error when the passed value is more than 150 characters", () => {
                const data: ICreateUserData = {
                    email: "CKY".repeat(100),
                    password: "hey",
                    identityProvider: UserIdentityProvider.LOCAL
                };

                return new UserService()
                    .createUser(data)
                    .then(() => {
                        throw new Error("Expected an error to be thrown");
                    })
                    .catch((error) => {
                        expect(error).toEqual(
                            expect.objectContaining({
                                details: [{ message: "Email cannot be more than 150 characters" }],
                                errorCode: "KMPW0015",
                                message: DefinedErrorCodes.KMPW0015,
                                statusCode: ErrorStatus.UnprocessableEntity
                            })
                        );
                        expect(error instanceof ValidationError).toEqual(true);
                    });
            });

            test("throws an error when the passed value is not a valid email", () => {
                const data: ICreateUserData = {
                    email: "email@example@example.com",
                    password: "hey",
                    identityProvider: UserIdentityProvider.LOCAL
                };

                return new UserService()
                    .createUser(data)
                    .then(() => {
                        throw new Error("Expected an error to be thrown");
                    })
                    .catch((error) => {
                        expect(error).toEqual(
                            expect.objectContaining({
                                details: [{ message: "Email is invalid" }],
                                errorCode: "KMPW0015",
                                message: DefinedErrorCodes.KMPW0015,
                                statusCode: ErrorStatus.UnprocessableEntity
                            })
                        );
                        expect(error instanceof ValidationError).toEqual(true);
                    });
            });
        }); // close describe("email")

        describe("password", () => {
            test("throws an error when the password contains spaces", () => {
                const data: ICreateUserData = {
                    email: "supercool@gmail.com",
                    password: " hey man slow down! ",
                    identityProvider: UserIdentityProvider.LOCAL
                };

                return new UserService()
                    .createUser(data)
                    .then(() => {
                        throw new Error("Expected an error to be thrown");
                    })
                    .catch((error) => {
                        expect(error).toEqual(
                            expect.objectContaining({
                                details: [{ message: "Password cannot contain spaces" }],
                                errorCode: "KMPW0015",
                                message: DefinedErrorCodes.KMPW0015,
                                statusCode: ErrorStatus.UnprocessableEntity
                            })
                        );
                        expect(error instanceof ValidationError).toEqual(true);
                    });
            });

            test("throws an error when the password is less than 8 characters", () => {
                const data: ICreateUserData = {
                    email: "supercool@gmail.com",
                    password: "hello",
                    identityProvider: UserIdentityProvider.LOCAL
                };

                return new UserService()
                    .createUser(data)
                    .then(() => {
                        throw new Error("Expected an error to be thrown");
                    })
                    .catch((error) => {
                        expect(error).toEqual(
                            expect.objectContaining({
                                details: [
                                    { message: "Password must be between 8 and 50 characters" }
                                ],
                                errorCode: "KMPW0015",
                                message: DefinedErrorCodes.KMPW0015,
                                statusCode: ErrorStatus.UnprocessableEntity
                            })
                        );
                        expect(error instanceof ValidationError).toEqual(true);
                    });
            });

            test("throws an error when the password is more than 50 characters", () => {
                const data: ICreateUserData = {
                    email: "supercool@gmail.com",
                    password: "hello".repeat(20),
                    identityProvider: UserIdentityProvider.LOCAL
                };

                return new UserService()
                    .createUser(data)
                    .then(() => {
                        throw new Error("Expected an error to be thrown");
                    })
                    .catch((error) => {
                        expect(error).toEqual(
                            expect.objectContaining({
                                details: [
                                    { message: "Password must be between 8 and 50 characters" }
                                ],
                                errorCode: "KMPW0015",
                                message: DefinedErrorCodes.KMPW0015,
                                statusCode: ErrorStatus.UnprocessableEntity
                            })
                        );
                        expect(error instanceof ValidationError).toEqual(true);
                    });
            });
        }); // close describe("password")

        describe("identityProvider", () => {
            test("throws an error when an invalid identity provider is passed", () => {
                const data: ICreateUserData = {
                    email: "supercool@gmail.com",
                    password: "safepasswordd00d!",
                    //@ts-ignore - Passing invalid value
                    identityProvider: "Windows 95"
                };

                return new UserService()
                    .createUser(data)
                    .then(() => {
                        throw new Error("Expected an error to be thrown");
                    })
                    .catch((error) => {
                        const validValues = Object.entries(UserIdentityProvider).map(([, v]) => v);

                        expect(error).toEqual(
                            expect.objectContaining({
                                details: [
                                    {
                                        message: `Invalid identity provider. Expected one of ${validValues.join(
                                            ", "
                                        )} but received: ${data.identityProvider}`
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
        }); // close describe("identityProvider");
    }); // close describe("Field Validation")

    describe("cleanUserRecord", () => {
        test("removes 'password' from the passed record", () => {
            const user = { id: "123", password: "secret!" };

            const cleanedUser = new UserService().cleanUserRecord(user);

            expect(cleanedUser).toEqual(expect.objectContaining({ id: "123" }));
            expect(user.password).toBeUndefined();
        });
    }); // close describe("cleanUserRecord")

    describe("isValidEmail", () => {
        describe("Valid Email Addresses", () => {
            const emailAddresses = [
                "email@example.com",
                "firstname.lastname@example.com",
                "email@subdomain.example.com",
                "firstname+lastname@example.com",
                `"email"@example.com`,
                "1234567890@example.com",
                "email@example-one.com",
                "_______@example.com",
                "email@example.name",
                "email@example.museum",
                "email@example.co.jp",
                "firstname-lastname@example.com"
            ];

            for (const email of emailAddresses) {
                test(`returns true when ${email} is passed`, () => {
                    expect(UserService.isValidEmail(email)).toEqual(true);
                });
            }
        }); // close describe("Valid Email Addresses")

        describe("Invalid Email Addresses", () => {
            const emailAddresses = [
                "plainaddress",
                "#@%^%#$@#$@#.com",
                "@example.com",
                "Joe Smith <email@example.com>",
                "email.example.com",
                "email@example@example.com",
                ".email@example.com",
                "email.@example.com",
                "email..email@example.com",
                "email@example.com (Joe Smith)",
                "email@example",
                "email@111.222.333.44444",
                "email@example..com",
                "Abc..123@example.com"
            ];

            for (const email of emailAddresses) {
                test(`returns true when ${email} is passed`, () => {
                    expect(UserService.isValidEmail(email)).toEqual(false);
                });
            }
        });
    }); // close describe("isValidEmail")
}); // close describe("User Service")
