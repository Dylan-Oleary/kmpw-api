import { User, UserIdentityProvider } from "@prisma/client";
import { isValueOfType } from "@theonlydevsever/utilities";
import bcrypt from "bcrypt";
import validateEmail from "deep-email-validator";
import { v4 as uuid } from "uuid";

import {
    AuthenticationError,
    BadRequestError,
    ConflictError,
    DefinedErrorCodes,
    NotFoundError,
    ValidationError
} from "errors";
import { prismaClient } from "lib";
import { ModelService } from "services";
import { ICreateUserData, IGetUserWhere, IServiceField, IUpdateUserData } from "types";

/**
 * Service used for administering `User` models
 */
class UserService extends ModelService<User> {
    readonly modelFields: IServiceField[] = [
        ...this.baseModelFields,
        this.generateServiceField({
            name: "email",
            type: "string",
            validation: async (value) => {
                if (value?.trim()?.length === 0)
                    throw new ValidationError(DefinedErrorCodes.KMPW0015, [
                        "Email cannot be empty"
                    ]).setErrorCode("KMPW0015");
                if (value?.trim().length > 150)
                    throw new ValidationError(DefinedErrorCodes.KMPW0015, [
                        "Email cannot be more than 150 characters"
                    ]).setErrorCode("KMPW0015");

                const isEmailValid = await UserService.isValidEmail(value);
                if (!isEmailValid)
                    throw new ValidationError(DefinedErrorCodes.KMPW0015, [
                        "Email is invalid"
                    ]).setErrorCode("KMPW0015");
            }
        }),
        this.generateServiceField({
            name: "password",
            type: "string",
            canEdit: false,
            validation: async (value) => {
                if (/\s/.test(value))
                    throw new ValidationError(DefinedErrorCodes.KMPW0015, [
                        "Password cannot contain spaces"
                    ]).setErrorCode("KMPW0015");
                if (value?.trim()?.length < 8 || value?.trim()?.length > 50)
                    throw new ValidationError(DefinedErrorCodes.KMPW0015, [
                        "Password must be between 8 and 50 characters"
                    ]).setErrorCode("KMPW0015");
            }
        }),
        this.generateServiceField({
            name: "reauthenticationAt",
            type: "date",
            isRequiredOnCreate: false,
            canCreate: false
        }),
        this.generateServiceField({
            name: "identityProvider",
            type: "string",
            canEdit: false,
            validation: async (value) => {
                const validValues = Object.entries(UserIdentityProvider).map(([, v]) => v);

                //@ts-ignore
                if (validValues.indexOf(value) === -1)
                    throw new ValidationError(DefinedErrorCodes.KMPW0015, [
                        `Invalid identity provider. Expected one of ${validValues.join(
                            ", "
                        )} but received: ${value}`
                    ]).setErrorCode("KMPW0015");
            }
        })
    ];

    constructor() {
        super();
    }

    /**
     * Authenticates a user against the passed email and password
     *
     * @param email An email address
     * @param password A password
     * @returns A user record
     */
    public authenticateUser(email = "", password = ""): Promise<Partial<User>> {
        return prismaClient.user
            .findFirst({
                where: { email, isDeleted: false },
                select: this.getPrismaSelectConfig()
            })
            .then(async (user) => {
                if (!user) {
                    return Promise.reject(
                        new NotFoundError(`User with email '${email}' does not exist`)
                    );
                }

                const match = await bcrypt.compare(password, user?.password);

                if (match) {
                    return this.cleanUserRecord(user);
                } else {
                    return Promise.reject(new AuthenticationError("Invalid credentials"));
                }
            });
    }

    /**
     * Removes all non-selectable fields from a user record
     *
     * @param user A user record
     * @returns A user record without any non-selectable fields
     */
    public cleanUserRecord(user: Partial<User>): Partial<User> {
        if (user?.password) delete user.password;

        return user;
    }

    /**
     * Creates a new user record in the system
     *
     * @param data User creation data
     * @returns A user record
     */
    public async createUser(data: ICreateUserData): Promise<Partial<User>> {
        try {
            const validatedData = await super.validateCreateData<ICreateUserData>(data);
            const { email, identityProvider, password } = validatedData;

            return prismaClient.user
                .findUnique({ where: { email } })
                .then((user) => {
                    if (user) {
                        return Promise.reject(
                            new ConflictError(`User with email '${email}' already exists`)
                        );
                    }

                    return bcrypt.hash(password, 10);
                })
                .then((hashedPassword) =>
                    prismaClient.user.create({
                        data: { email, password: hashedPassword, identityProvider },
                        select: this.getPrismaSelectConfig()
                    })
                )
                .then((newUser) => this.cleanUserRecord(newUser));
        } catch (error) {
            throw error;
        }
    }

    /**
     * Performs a soft delete on an existing user record
     *
     * @param id The id of the user to delete
     */
    public async deleteUser(id: string): Promise<void> {
        try {
            const userRecord = await this.getUser({ id, isDeleted: false });
            const email = `${userRecord?.email}_${uuid()}`;

            await prismaClient.user.update({
                where: { id },
                data: { email, isDeleted: true, reauthenticationAt: new Date() }
            });

            return;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Updates an existing user record in the system
     *
     * @param id The id of the user to update
     * @param data The data to update the user with
     * @returns The updated user record
     */
    public async updateUser(id: string, data: IUpdateUserData): Promise<Partial<User>> {
        try {
            const validatedData = await super.validateUpdateData<IUpdateUserData>(data);

            return prismaClient.user.update({ where: { id }, data: validatedData }).then((user) => {
                if (!user) {
                    return Promise.reject(new NotFoundError("User not found"));
                }

                return this.cleanUserRecord(user);
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Returns a user record based on the passed options
     *
     * @param opts Options used to filter for the correct user
     * @returns A user record
     */
    public getUser(opts: IGetUserWhere): Promise<Partial<User>> {
        const where: IGetUserWhere = {
            email: opts?.email,
            id: opts?.id,
            isDeleted: opts?.isDeleted || false
        };

        for (const [key, value] of Object.entries(where)) {
            if (isValueOfType(value, "undefined")) delete where[key];
        }

        if (!where.id && !where.email) {
            return Promise.reject(new BadRequestError("Cannot find user without an id or email"));
        }

        return prismaClient.user
            .findFirst({ where, select: this.getPrismaSelectConfig() })
            .then((user) => {
                if (!user) {
                    return Promise.reject(
                        new NotFoundError("User not found").setErrorCode("KMPW0020")
                    );
                }

                return this.cleanUserRecord(user);
            });
    }

    /**
     * Determines whether or not the passed value is a valid email address
     *
     * @param email The email to test
     * @returns `true` if the email is valid, `false` if not
     */
    public static async isValidEmail(email: string): Promise<boolean> {
        const res = await validateEmail(email);
        // eslint-disable-next-line no-console
        console.log(res);
        return res?.valid ?? false;
    }
}

export default UserService;
export { UserService };
