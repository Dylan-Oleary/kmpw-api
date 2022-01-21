import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";
import extend from "extend";

import { resolvers as breedResolvers, typeDefinitions as breedTypeDefs } from "./breed";
import { resolvers as dogResolvers, typeDefinitions as dogTypeDefs } from "./dog";
import {
    resolvers as safetyLevelResolvers,
    typeDefinitions as safetyLevelTypeDefs
} from "./safetyLevel";
import { resolvers as userResolvers, typeDefinitions as userTypeDefs } from "./user";
import {
    resolvers as weatherApiResolvers,
    typeDefinitions as weatherApiTypeDefs
} from "./weatherApi";

const typeDefinitions: DocumentNode = gql`
    ${breedTypeDefs}
    ${dogTypeDefs}
    ${safetyLevelTypeDefs}
    ${userTypeDefs}
    ${weatherApiTypeDefs}
`;

const resolvers = extend(
    true,
    breedResolvers,
    dogResolvers,
    safetyLevelResolvers,
    userResolvers,
    weatherApiResolvers
);

export { resolvers, typeDefinitions };
