import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";

import { BadRequestError } from "errors";
import { addUserToRequestData, prismaClient } from "lib";
import { DogService, SafetyLevelService } from "services";
import { ICreateDogData, IDeleteDogData } from "types";

export const typeDefinitions: DocumentNode = gql`
    enum WeightClass {
        SMALL
        MEDIUM
        LARGE
    }

    type DogSize {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        isDeleted: Boolean!
        weightClass: WeightClass!
    }

    type Dog {
        id: ID!
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
        safetyLevel: SafetyLevel!
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
        createDog(data: CreateDogData!, temperatureFarenheit: Float): Dog
        deleteDog(id: ID!): ID!
    }
`;

export const resolvers = {
    Dog: {
        breed: ({ breedId: id }) => prismaClient.breed.findUnique({ where: { id } }),
        safetyLevel: (dog) => {
            const { temperatureFarenheit } = dog;

            if (!temperatureFarenheit) {
                throw new BadRequestError("Temperature missing from request");
            }

            return new SafetyLevelService()
                .setTemperature(temperatureFarenheit)
                .setDog(dog)
                .then((service) => service.calculateSafetyLevel().getSafetyLevel());
        },
        size: ({ sizeId: id }) => prismaClient.dogSize.findUnique({ where: { id } })
    },
    Mutation: {
        createDog: (_, { data, temperatureFarenheit }, { user }) =>
            new DogService()
                .createDog(addUserToRequestData<ICreateDogData>(user, data))
                .then((dog) => ({ ...dog, temperatureFarenheit })),
        deleteDog: (_, args, { user }) =>
            new DogService()
                .deleteDog(addUserToRequestData<IDeleteDogData>(user, args))
                .then(({ id }) => id)
    }
};
