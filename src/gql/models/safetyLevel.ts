import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";

import { BadRequestError } from "errors";
import { SafetyLevelService } from "services";
import { SafetyLevelModel } from "types";

export const typeDefinitions: DocumentNode = gql`
    type SafetyLevel {
        level: Int!
        message: String!
    }

    input SafetyLevelBreedData {
        id: String!
        weightImperial: Float
    }

    extend type Query {
        breedSafetyLevel(breed: SafetyLevelBreedData!, temperatureFarenheit: Float!): SafetyLevel
    }
`;

export const resolvers = {
    Query: {
        breedSafetyLevel: (_, args) => {
            const { breed, temperatureFarenheit } = args;

            if (!temperatureFarenheit) {
                throw new BadRequestError("Temperature missing from request");
            }

            return new SafetyLevelService()
                .setTemperature(temperatureFarenheit)
                .setDog(breed, SafetyLevelModel.BREED)
                .then((service) => service.calculateSafetyLevel().getSafetyLevel());
        }
    }
};
