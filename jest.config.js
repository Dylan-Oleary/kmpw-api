module.exports = {
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/lib/printEnv.ts",
        "!src/**/index.ts",
        "!src/types/*",
        "!src/gql/**/*",
        "!src/config/*"
    ],
    coverageDirectory: "coverage",
    globals: {
        "ts-jest": {
            tsconfig: "./tsconfig.test.json",
            diagnostics: false
        }
    },
    moduleDirectories: ["node_modules", "src"],
    moduleNameMapper: {
        "^config/(.*)$": "<rootDir>/src/config/$1",
        "^errors/(.*)$": "<rootDir>/src/errors/$1",
        "^gql/(.*)$": "<rootDir>/src/gql/$1",
        "^lib/(.*)$": "<rootDir>/src/lib/$1",
        "^middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
        "^root/(.*)$": "<rootDir>/src/$1",
        "^routes/(.*)$": "<rootDir>/src/routes/$1",
        "^services/(.*)$": "<rootDir>/src/services/$1",
        "^types/(.*)$": "<rootDir>/src/types/$1"
    },
    preset: "ts-jest",
    roots: ["<rootDir>/src"],
    setupFiles: ["./jest/setEnvVars.js"],
    setupFilesAfterEnv: ["./jest/testSetup.js", "jest-extended/all"],
    testEnvironment: "node",
    testTimeout: 30000,
    transform: {
        "^.+\\.(ts)$": "ts-jest"
    }
};
