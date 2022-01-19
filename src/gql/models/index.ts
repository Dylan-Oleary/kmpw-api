import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";
import extend from "extend";

import { resolvers as dogResolvers, typeDefinitions as dogTypeDefs } from "./dog";
import {
    resolvers as safetyLevelResolvers,
    typeDefinitions as safetyLevelTypeDefs
} from "./safetyLevel";
import {
    resolvers as weatherApiResolvers,
    typeDefinitions as weatherApiTypeDefs
} from "./weatherApi";

const typeDefinitions: DocumentNode = gql`
    ${dogTypeDefs}
    ${safetyLevelTypeDefs}
    ${weatherApiTypeDefs}
`;

const resolvers = extend(true, dogResolvers, safetyLevelResolvers, weatherApiResolvers);

export { resolvers, typeDefinitions };
