import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";

import { addUserToRequestData, prismaClient } from "lib";
import { DogService } from "services";
import { ICreateDogData } from "types";

export const typeDefinitions: DocumentNode = gql`
    enum WeightClass {
        SMALL
        MEDIUM
        LARGE
    }

    type DogSize {
        id: String!
        createdAt: DateTime!
        updatedAt: DateTime!
        isDeleted: Boolean!
        weightClass: WeightClass!
    }

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
        breed: Breed!
        size: DogSize!
    }

    input CreateDogData {
        name: String!
        description: String
        birthday: DateTime
        profilePicture: String
        heightImperial: Float
        weightImperial: Float!
        breedId: String!
    }

    extend type Mutation {
        createDog(data: CreateDogData!): Dog
    }
`;

export const resolvers = {
    Dog: {
        breed: ({ breedId: id }) => prismaClient.breed.findUnique({ where: { id } }),
        size: ({ sizeId: id }) => prismaClient.dogSize.findUnique({ where: { id } })
    },
    Mutation: {
        createDog: (_, { data }, { user }) =>
            new DogService().createDog(addUserToRequestData<ICreateDogData>(user, data))
    }
};
