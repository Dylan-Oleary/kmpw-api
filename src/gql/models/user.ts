import { User } from "@prisma/client";
import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";

import { prismaClient } from "lib";
import { UserService, WeatherService } from "services";
import { ICurrentWeather, ICurrentWeatherWhere } from "types";

export type MeQueryResponse = Partial<User> & {
    temperatureFarenheit?: number;
    weather?: ICurrentWeather;
};

export const typeDefinitions: DocumentNode = gql`
    type User {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        isDeleted: Boolean!
        reauthenticationAt: DateTime
        email: String!
        dogs: [Dog]
        weather: CurrentWeatherResponse
    }

    extend type Query {
        me(location: CurrentWeatherWhere, temperatureFarenheit: Float): User
    }
`;

export const resolvers = {
    Query: {
        me: (
            _,
            args: { location?: ICurrentWeatherWhere; temperatureFarenheit?: number },
            { user }
        ): Promise<MeQueryResponse> =>
            new UserService().getUser({ id: user?.id }).then((user) => {
                const { location } = args;

                if (location) {
                    return new WeatherService()
                        .getWeather({ id: user?.id, location })
                        .then(({ alert, current, location }) => ({
                            ...user,
                            weather: { alert, current, location }
                        }));
                }

                return { ...user, ...args };
            })
    },
    User: {
        dogs: ({ id: userId, ...args }) =>
            prismaClient.dog
                .findMany({ where: { isDeleted: false, userId } })
                .then((dogs) => dogs.map((dog) => ({ ...dog, ...args })))
    }
};
