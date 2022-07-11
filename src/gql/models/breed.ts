import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";

import { prismaClient } from "lib";

export const typeDefinitions: DocumentNode = gql`
    type BreedGroup {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        isDeleted: Boolean!
        name: String!
        description: String
        breeds: [Breed!]!
    }

    type Breed {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        isDeleted: Boolean!
        name: String!
        description: String
        heightImperialMin: Float!
        heightImperialMax: Float!
        heightImperialAvg: Float!
        heightMetricMin: Float!
        heightMetricMax: Float!
        heightMetricAvg: Float!
        lifeSpanMin: Int!
        lifeSpanMax: Int!
        lifeSpanAvg: Int!
        origin: String
        weightImperialMin: Float!
        weightImperialMax: Float!
        weightImperialAvg: Float!
        wikipediaUrl: String
        countryCode: String
        size: DogSize!
        breedGroup: BreedGroup!
    }

    extend type Query {
        breeds: [Breed!]!
        breedGroups: [BreedGroup!]!
    }
`;

export const resolvers = {
    Breed: {
        breedGroup: ({ breedGroupId: id }) => prismaClient.breedGroup.findUnique({ where: { id } }),
        size: ({ sizeId: id }) => prismaClient.dogSize.findUnique({ where: { id } })
    },
    BreedGroup: {
        breeds: ({ id }) =>
            prismaClient.breed.findMany({ where: { breedGroupId: id }, orderBy: [{ name: "asc" }] })
    },
    Query: {
        breeds: () =>
            prismaClient.breed.findMany({
                orderBy: [{ name: "asc" }]
            }),
        breedGroups: () =>
            prismaClient.breedGroup.findMany({
                orderBy: [{ name: "asc" }]
            })
    }
};
