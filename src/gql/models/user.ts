import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";

import { prismaClient } from "lib";
import { UserService } from "services";

export const typeDefinitions: DocumentNode = gql`
    type User {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        isDeleted: Boolean!
        reauthenticationAt: DateTime
        email: String!
        dogs: [Dog]
    }

    extend type Query {
        me(temperatureFarenheit: Float): User
    }
`;

export const resolvers = {
    Query: {
        me: (_, args, { user }) =>
            new UserService().getUser({ id: user.id }).then((user) => ({ ...user, ...args }))
    },
    User: {
        dogs: ({ id: userId, temperatureFarenheit }) =>
            prismaClient.dog
                .findMany({ where: { isDeleted: false, userId } })
                .then((dogs) => dogs.map((dog) => ({ ...dog, temperatureFarenheit })))
    }
};
