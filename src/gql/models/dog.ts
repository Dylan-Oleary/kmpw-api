import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";
import { Dog, SafetyLevel } from "@prisma/client";
import { isValueOfType } from "@theonlydevsever/utilities";

import { addUserToRequestData, prismaClient } from "lib";
import { DogService, SafetyLevelService } from "services";
import { ICreateDogData, ICurrentWeather, IDogIdentifier } from "types";

export type DogWithResolverArgs = Dog & {
    temperatureFarenheit?: number;
    weather?: ICurrentWeather;
};

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
        safetyLevel: SafetyLevel
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

    input UpdateDogData {
        name: String
        description: String
        birthday: DateTime
        profilePicture: String
        heightImperial: Float
        weightImperial: Float
        breedId: String
    }

    extend type Mutation {
        createDog(data: CreateDogData!, temperatureFarenheit: Float): Dog
        deleteDog(id: ID!): ID!
        updateDog(id: ID!, data: UpdateDogData!, temperatureFarenheit: Float): Dog
    }
`;

export const resolvers = {
    Dog: {
        breed: ({ breedId: id }: DogWithResolverArgs) =>
            prismaClient.breed.findUnique({ where: { id } }),
        safetyLevel: (dog: DogWithResolverArgs): Promise<SafetyLevel> => {
            const { temperatureFarenheit, weather } = dog;
            let temperatureToUse = temperatureFarenheit;

            if (weather) {
                const { alert } = weather;

                if (alert) {
                    return new SafetyLevelService()
                        .setSafetyLevel(alert?.recommendedSafetyLevel)
                        .getSafetyLevel()
                        .then((safetyLevel) => ({
                            ...safetyLevel,
                            message: "Use your best judgment!"
                        }));
                }

                temperatureToUse = weather?.current?.temp_f;
            }

            // @ts-ignore
            if (!isValueOfType(parseFloat(temperatureToUse), "number")) {
                return null;
            }

            return new SafetyLevelService()
                .setTemperature(temperatureToUse)
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
                .deleteDog(addUserToRequestData<IDogIdentifier>(user, args))
                .then(({ id }) => id),
        updateDog: (_, { data, id, temperatureFarenheit }, { user }) =>
            new DogService()
                .updateDog(
                    addUserToRequestData<IDogIdentifier>(user, { id } as IDogIdentifier),
                    data
                )
                .then((dog) => ({ ...dog, temperatureFarenheit }))
    }
};
