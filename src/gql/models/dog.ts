import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";

import { DogService } from "services";

export const typeDefinitions: DocumentNode = gql`
    type Dog {
        id: String!
        createdAt: DateTime!
        updatedAt: DateTime!
        isDeleted: Boolean!
        name: String!
        description: String
        birthday: DateTime
        profilePicture: String
        heightImperial: Float
        heightMetric: Float
        weightImperial: Float!
        weightMetric: Float!
    }

    input CreateDogData {
        name: String!
        description: String
        birthday: DateTime
        profilePicture: String
        heightImperial: Float
        weightImperial: Float!
    }

    extend type Mutation {
        createDog(data: CreateDogData!): Dog
    }
`;

export const resolvers = {
    Mutation: {
        createDog: (_, { data }) => {
            return new DogService().createDog(data);
        }
    }
};
