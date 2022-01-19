import { gql } from "apollo-server-express";
import extend from "extend";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLSchema } from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";

import { resolvers, typeDefinitions } from "./models";

/**
 * Builds an executable GraphQL schema
 *
 * @returns A configured GraphQL schema
 */
export const buildGqlSchema: () => GraphQLSchema = () =>
    makeExecutableSchema({
        typeDefs: gql`
            scalar DateTime
            type Mutation {
                _: Boolean
            }
            type Query {
                _: Boolean
            }
            ${typeDefinitions}
        `,
        resolvers: extend(
            true,
            { DateTime: GraphQLDateTime, Mutation: { _: () => true }, Query: { _: () => true } },
            resolvers
        )
    });
