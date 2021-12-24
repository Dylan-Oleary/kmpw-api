import { gql } from "apollo-server-express";
import extend from "extend";
import { GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { resolvers, typeDefinitions } from "./models";
import { WeatherApiService } from "services";

/**
 * Builds an executable GraphQL schema
 *
 * @returns A configured GraphQL schema
 */
export const buildGqlSchema: () => GraphQLSchema = () => {
    const weatherApiService = new WeatherApiService();

    return makeExecutableSchema({
        typeDefs: gql`
            type Query {
                _: Boolean
            }
            ${WeatherApiService.getGqlTypeDefinitions()}
            ${typeDefinitions}
        `,
        resolvers: extend(
            true,
            { Query: { _: () => true } },
            weatherApiService.getGqlTypeResolvers(),
            resolvers
        )
    });
};
