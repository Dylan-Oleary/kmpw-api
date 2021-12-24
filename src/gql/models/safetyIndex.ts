import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";

import { SafetyIndexService } from "services";

export const typeDefinitions: DocumentNode = gql`
    type SafetyIndex {
        level: Int!
        message: String!
    }

    enum SafetyIndexModel {
        BREED
        DOG
    }

    input SafetyIndexDogData {
        id: String!
        model: SafetyIndexModel!
        weightImperial: Float
    }

    extend type Query {
        getSafetyIndex(temperatureFarenheit: Int!, dog: SafetyIndexDogData!): SafetyIndex
    }
`;

export const resolvers = {
    Query: {
        getSafetyIndex: (_, args) => {
            const { dog, temperatureFarenheit } = args;

            return new SafetyIndexService()
                .setTemperature(temperatureFarenheit)
                .setDog(dog)
                .then(() => {
                    return { level: 1, message: "test" };
                });
        }
    }
};
