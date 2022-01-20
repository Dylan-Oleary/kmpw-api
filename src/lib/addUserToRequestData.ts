import { User } from "@prisma/client";

/**
 * Merges incoming request data with the passed user
 *
 * @param user A user record
 * @param data The incoming data from the request
 * @returns an object that contains both the request data and the user id
 */
const addUserToRequestData: <T>(user: User, data: T) => T & { userId: string } = (user, data) => {
    const { id } = user;

    return { ...data, userId: id };
};

export default addUserToRequestData;
export { addUserToRequestData };
