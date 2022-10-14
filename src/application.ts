import { ApolloServer } from "apollo-server-express";
import compression from "compression";
import cookieParser from "cookie-parser";
import express, { Express, NextFunction, Request, Response } from "express";

import { buildGqlSchema, convertErrorToGqlError, formatGqlError } from "gql";
import {
    catchAllHandler,
    globalErrorHandler,
    verifyAccessToken,
    verifyAccessTokenGraphQL
} from "middlewares";
import { assetsRouter, authRouter, baseRouter, userRouter } from "routes";
import { UserService } from "services";

/**
 * Initializes and configures an express application
 *
 * @returns An express application
 */
const initializeApplication: () => Promise<Express> = async () => {
    const app = express();

    try {
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(compression());
        app.use(cookieParser());

        app.use("/", baseRouter);
        app.use("/auth", authRouter);

        app.use("/assets", verifyAccessToken, assetsRouter);
        app.use("/users", verifyAccessToken, userRouter);

        const gqlServer = new ApolloServer({
            context: async ({ req }) => {
                try {
                    if (req?.body?.operationName === "IntrospectionQuery") {
                        return {};
                    }

                    const { sub: id } = await verifyAccessTokenGraphQL(req);
                    const user = await new UserService().getUser({ id });

                    return { user };
                } catch (error) {
                    throw convertErrorToGqlError(error);
                }
            },
            formatError: formatGqlError,
            introspection: process?.env?.NODE_ENV !== "production",
            schema: buildGqlSchema()
        });

        await gqlServer.start();
        gqlServer.applyMiddleware({
            app,
            path: "/gql"
        });

        app.use("*", catchAllHandler);

        // Disable linting for `next` as it is unused, but required as an argument
        // eslint-disable-next-line
        app.use((error: Error, req: Request, res: Response, next: NextFunction) =>
            globalErrorHandler(error, res)
        );

        return app;
    } catch (error) {
        console.error(error);
        console.error("Application has failed to start");

        process.exit(1);
    }
};

export default initializeApplication;
export { initializeApplication };
