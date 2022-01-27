import { gql } from "apollo-server-express";
import extend from "extend";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLSchema } from "graphql";
import { DateTimeResolver, DateTimeTypeDefinition } from "graphql-scalars";

import { resolvers, typeDefinitions } from "./models";

/**
 * Builds an executable GraphQL schema
 *
 * @returns A configured GraphQL schema
 */
export const buildGqlSchema: () => GraphQLSchema = () =>
    makeExecutableSchema({
        typeDefs: gql`
            type Mutation {
                _: Boolean
            }
            type Query {
                _: Boolean
            }
            ${DateTimeTypeDefinition}
            ${typeDefinitions}
        `,
        resolvers: extend(
            true,
            { DateTime: DateTimeResolver, Mutation: { _: () => true }, Query: { _: () => true } },
            resolvers
        )
    });
