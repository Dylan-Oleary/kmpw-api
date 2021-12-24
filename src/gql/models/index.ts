import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";
import extend from "extend";

import {
    resolvers as safetyIndexResolvers,
    typeDefinitions as safetyIndexTypeDefs
} from "./safetyIndex";

const typeDefinitions: DocumentNode = gql`
    ${safetyIndexTypeDefs}
`;

const resolvers = extend(true, { Query: { _: () => true } }, safetyIndexResolvers);

export { resolvers, typeDefinitions };
