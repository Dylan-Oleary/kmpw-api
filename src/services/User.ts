import { User } from "@prisma/client";
import { isValueOfType } from "@theonlydevsever/utilities";
import bcrypt from "bcrypt";

import { AuthenticationError, BadRequestError, ConflictError, NotFoundError } from "errors";
import { prismaClient } from "lib";
import { ICreateUserData, IEditUserData, IGetUserWhere } from "types";

class UserService {
    private readonly _prismaUserSelectConfig = {
        id: true,
        identityProvider: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        reauthenticationAt: true,
        password: true
    };

    constructor() {}

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
                select: this._prismaUserSelectConfig
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
    public createUser(data: ICreateUserData): Promise<Partial<User>> {
        const { email, identityProvider, password } = data;

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
                    select: this._prismaUserSelectConfig
                })
            )
            .then((newUser) => this.cleanUserRecord(newUser));
    }

    /**
     * Updates an existing user record in the system
     *
     * @param id The id of the user to update
     * @param data The data to update the user with
     * @returns The updated user record
     */
    public updateUser(id: string, data: IEditUserData): Promise<Partial<User>> {
        const editData = { ...data };

        for (const [key, value] of Object.entries(editData)) {
            if (isValueOfType(value, "undefined")) delete editData[key];
        }

        return prismaClient.user.update({ where: { id }, data: editData }).then((user) => {
            if (!user) {
                return Promise.reject(new NotFoundError("User not found"));
            }

            return this.cleanUserRecord(user);
        });
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
            .findFirst({ where, select: this._prismaUserSelectConfig })
            .then((user) => {
                if (!user) {
                    return Promise.reject(new NotFoundError("User not found"));
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
    public static isValidEmail(email: string): boolean {
        return new RegExp(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "g"
        ).test(email);
    }
}

export default UserService;
export { UserService };
