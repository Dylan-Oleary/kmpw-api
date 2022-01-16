import { UserIdentityProvider } from "@prisma/client";

export interface ICreateUserData {
    /**
     * The email of the new user
     */
    email: string;
    /**
     * The plain text password of the new user
     */
    password: string;
    /**
     * The source where the user provided their credentials – will affect future authentication
     */
    identityProvider: UserIdentityProvider;
}

export interface IGetUserWhere {
    /**
     * The id of the user
     */
    id?: string;
    /**
     * The email of the user
     */
    email?: string;
    /**
     * The deletion status of the user
     */
    isDeleted?: boolean;
}
