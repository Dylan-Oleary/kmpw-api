import { gql } from "apollo-server-express";
import extend from "extend";
import { GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { resolvers, typeDefinitions } from "./models";

/**
 * Builds an executable GraphQL schema
 *
 * @returns A configured GraphQL schema
 */
export const buildGqlSchema: () => GraphQLSchema = () =>
    makeExecutableSchema({
        typeDefs: gql`
            type Query {
                _: Boolean
            }
            ${typeDefinitions}
        `,
        resolvers: extend(true, { Query: { _: () => true } }, resolvers)
    });
