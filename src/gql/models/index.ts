import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";
import extend from "extend";

import {
    resolvers as safetyLevelResolvers,
    typeDefinitions as safetyLevelTypeDefs
} from "./safetyLevel";
import {
    resolvers as weatherApiResolvers,
    typeDefinitions as weatherApiTypeDefs
} from "./weatherApi";

const typeDefinitions: DocumentNode = gql`
    ${safetyLevelTypeDefs}
    ${weatherApiTypeDefs}
`;

const resolvers = extend(
    true,
    { Query: { _: () => true } },
    safetyLevelResolvers,
    weatherApiResolvers
);

export { resolvers, typeDefinitions };
