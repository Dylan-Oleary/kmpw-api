# Keep My Paws Warm API

The API application for Keep My Paws Warm!

## Environment Setup

This project uses [Node](https://nodejs.org/en/) version `14.17.5`

```
nvm use 14.17.5
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
