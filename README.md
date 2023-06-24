# Woxy API

The API application for Woxy

## Environment Setup

This project uses [Node](https://nodejs.org/en/) version `16.13.1`

```
nvm use 16.13.1
```

## Installation

Using [yarn](https://yarnpkg.com/)

```
yarn
```

Using [npm](https://www.npmjs.com/)

```
npm install
```

## Getting Started

1. Add `.env` file

```
# Env Config
ACCESS_TOKEN_LIFESPAN=1d
AWS_REKOGNITION=1
AWS_REKOGNITION_REGION=us-east-1
DOG_API_BASE_URL=https://api.thedogapi.com/v1
CLOUDINARY_CLOUD_NAME=dhgpgb0yw
CLOUDINARY_FOLDER_PREFIX=kmpw
REFRESH_TOKEN_LIFESPAN=7d
SENTRY_ENABLED=1
SENTRY_SAMPLE_RATE=0.75
USER_MAX_NUM_OF_DOGS=5
WEATHER_API_BASE_URL=http://api.weatherapi.com/v1
WEATHER_API_MODERATE_ALERT_CODES=
WEATHER_API_SEVERE_ALERT_CODES=1063,1066,1069,1072,1087,1114,1117,1168,1171,1195,1201,1207,1219,1222,1225,1237,1246,1252,1258,1261,1264,1273,1276,1279,1282
WEATHER_CACHE_DISTANCE_METRES=5000
WEATHER_CACHE_LIFESPAN=5m

# Env Secrets
ACCESS_TOKEN_SECRET=superdupersecret
AWS_ACCESS_KEY_ID=<REDACTED>
AWS_SECRET_KEY=<REDACTED>
CLOUDINARY_API_KEY=<REDACTED>
CLOUDINARY_API_SECRET=<REDACTED>
DATABASE_URL=<REDACTED>
DOG_API_KEY=<REDACTED>
REDIS_HOST=<REDACTED>
REFRESH_TOKEN_SECRET=superdupersecret
SENTRY_DSN=<REDACTED>
WEATHER_API_KEY=<REDACTED>
```

2. Start Docker containers

```
docker-compose up -d
```

3. Hydrate database

```
yarn prisma:migrate && yarn prisma:seed
```

## Running the Development Server

```
yarn dev
```

## Module Aliases

This project uses TypeScript module aliases to allow for more readable `import` statements in files

```js
import module from "../../../modules";

// Can be changed to...

import module from "modules";
```

If you'd like to add aliases, they must be registered in `tsconfig.json` and `jest.config.js`.

For example, let's add a folder called `modules` that lives at `src/modules`.

### tsconfig.json

```js
"paths": {
    "errors/*": ["errors/*"],
    "lib/*": ["lib/*"],
    "middlewares/*": ["middlewares/*"],
    "root/*": ["*"],
    "routes/*": ["routes/*"],
    // Add your new alias
    "modules/*": ["modules/*"]
}
```

### jest.config.js

```js
moduleNameMapper: {
    "^errors/(.*)$": "<rootDir>/src/errors/$1",
    "^lib/(.*)$": "<rootDir>/src/lib/$1",
    "^middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
    "^root/(.*)$": "<rootDir>/src/$1",
    "^routes/(.*)$": "<rootDir>/src/routes/$1",
    // Add your new alias
    "^modules/(.*)$": "<rootDir>/src/modules/$1"
}
```
