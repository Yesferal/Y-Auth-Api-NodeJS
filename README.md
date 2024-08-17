# Yesferal Auth API Node

This is an authentication express app used in all Yesferal Cueva projects.

## Create a NodeJS project
Create a new NodeJs project.
```
npm init
```

## Use TS instead of JS
We will install TS and @types/node as dev dependencies, but you can skip all this section if you are planning to use JS instead.
```
npm i -D typescript
```
```
npm install @types/node --save-dev 
```

Init TSC, this is going to create a `tsconfig.json` file that we should modify.
```
tsc --init 
```

We will uncomment:

```
"sourceMap": true
```

We should uncomment the next lines inside the `tsconfig.json` file in order to get a custom JS and TS performance.
```
"outDir": "./dist",
```

This one is important becuase it let us have a correctly nested .js files exactly like .ts files were nested.
```
"rootDir": "./src",
```

Also, you could append the `include` & `exclude` block after `compilerOptions` block.
```
"compilerOptions": {
     ...
},
"include": [
    "src/**/*.ts" /* Include every ts file in source folder */
],
"exclude": [
    "node_modules" /* Exclude everything in node_modules */
]
```

Update the scripts value inside the `package.json` file in order to build and run easily, but this is just an optional step.
```
"build:dev": "tsc --watch --preserveWatchOutput",
"start:dev": "nodemon --require dotenv/config dist/presentation/server.js",
"dev": "concurrently \"npm:build:dev\" \"npm:start:dev\"",
"build": "npx tsc",
"start": "node dist/presentation/server.js"
```

## Install Dev dependency
All the following packages should be added as `devDependencies` since they aren't required in a production environment.


If you want to run two commands simultaneously, you can use the `concurrently` package.
```
npm i concurrently --save-dev
```
If you want to simulate the Environment variables, you can use the `dotenv` package.
```
npm i dotenv --save-dev
```
```
npm i @types/dotenv --save-dev
```
If you want the app/server to automatically restart every time you save a change, you can use the `nodemon` package.
```
npm i nodemon --save-dev
```

## Set up an Express app
As we are planning to expose our data through an API, we'll use the Express package to accomplish this.

```
npm i express
```
```
npm i @types/express --save-dev
```

## Install NPM dependencies
First, this project needs Git and Node JS previously installed, the steps for installation depend on the OS you have.

Then, you should clone the repository.

Finally, you need to install the project dependencies like `typescript`, `express` or `y-auth-nodejs`.
```
npm install
``` 

## Run the DEV project version
For the Dev version, we can use a single command to run both `npm:build:dev` and `npm:start:dev` concurrently. This means the dev command will build and start a non-production version.

```
npm run dev 
```

## Build the PROD project
Open a terminal and run build in order to generate JS code based on the TS one
```
npm run build
```
Finally, start the Express server project
```
npm run start
```

---
## License
```
Copyright 2024 Bet-NodeJs Contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```