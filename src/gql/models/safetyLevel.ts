import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";

import { SafetyLevelService } from "services";

export const typeDefinitions: DocumentNode = gql`
    type SafetyLevel {
        level: Int!
        message: String!
    }

    enum SafetyLevelModel {
        BREED
        DOG
    }

    input SafetyLevelDogData {
        id: String!
        model: SafetyLevelModel!
        weightImperial: Float
    }

    extend type Query {
        getSafetyLevel(temperatureFarenheit: Float!, dog: SafetyLevelDogData!): SafetyLevel
    }
`;

export const resolvers = {
    Query: {
        getSafetyLevel: (_, args) => {
            const { dog, temperatureFarenheit } = args;

            return new SafetyLevelService()
                .setTemperature(temperatureFarenheit)
                .setDog(dog)
                .then((service) => service.calculateSafetyLevel().getSafetyLevel());
        }
    }
};
