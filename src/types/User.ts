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
