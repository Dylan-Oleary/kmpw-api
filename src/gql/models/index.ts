import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";
import extend from "extend";

import {
    resolvers as safetyIndexResolvers,
    typeDefinitions as safetyIndexTypeDefs
} from "./safetyIndex";
import {
    resolvers as weatherApiResolvers,
    typeDefinitions as weatherApiTypeDefs
} from "./weatherApi";

const typeDefinitions: DocumentNode = gql`
    ${safetyIndexTypeDefs}
    ${weatherApiTypeDefs}
`;

const resolvers = extend(
    true,
    { Query: { _: () => true } },
    safetyIndexResolvers,
    weatherApiResolvers
);

export { resolvers, typeDefinitions };
