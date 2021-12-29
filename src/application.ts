import { ApolloServer } from "apollo-server-express";
import compression from "compression";
import express, { Express, NextFunction, Request, Response } from "express";
import Redis from "ioredis";

import { REDIS } from "config";
import { buildGqlSchema } from "gql";
import { catchAllHandler, globalErrorHandler } from "middlewares";
import { authRouter, baseRouter } from "routes";

/**
 * Initializes and configures an express application
 *
 * @returns An express application
 */
const initializeApplication: () => Promise<Express> = async () => {
    const app = express();

    try {
        app.set(REDIS, new Redis(parseInt(process?.env?.REDIS_PORT) || 6379));

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(compression());

        app.use("/", baseRouter);
        app.use("/auth", authRouter);

        const gqlServer = new ApolloServer({ schema: buildGqlSchema() });

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
