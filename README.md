# Keep My Paws Warm API

The API application for Keep My Paws Warm!

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
MYSQL_PORT=3306
MYSQL_ROOT_PASSWORD=frogger
MYSQL_DATABASE=kmpw
MYSQL_USER=admin
MYSQL_PASSWORD=supersecret
REDIS_PORT=6379
ACCESS_TOKEN_LIFESPAN=15m
ACCESS_TOKEN_SECRET=superdupersecret
REFRESH_TOKEN_LIFESPAN=7d
REFRESH_TOKEN_SECRET=superdupersecret
DATABASE_URL=mysql://root:frogger@localhost:3306/kmpw
DOG_API_KEY=<PRIVATE>
DOG_API_BASE_URL=https://api.thedogapi.com/v1
WEATHER_API_KEY=<PRIVATE>
WEATHER_API_BASE_URL=http://api.weatherapi.com/v1
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
