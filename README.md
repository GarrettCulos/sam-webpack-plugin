<h1 style="text-align:center"> SAM-Webpack-Plugin</h1>

<p style="text-align:center">
  <a href="https://circleci.com/gh/garrettculos/sam-webpack-plugin/tree/dev">
    <img src="https://circleci.com/gh/GarrettCulos/sam-webpack-plugin.svg?style=shield&circle-token=e22c541987ebae9756fcf4ab3774cf887d20bfa0" alt="Build Status">
  </a>  
  <a href="https://codecov.io/gh/GarrettCulos/sam-webpack-plugin">
    <img src="https://codecov.io/gh/GarrettCulos/sam-webpack-plugin/branch/master/graph/badge.svg" />
  </a>
  <a href="https://www.npmjs.com/package/sam-webpack-plugin"><img src="https://img.shields.io/npm/dt/sam-webpack-plugin.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/sam-webpack-plugin"><img src="https://img.shields.io/npm/v/sam-webpack-plugin.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/sam-webpack-plugin"><img src="https://img.shields.io/npm/l/sam-webpack-plugin.svg" alt="License"></a>
</p>

---

## Project Goal / Use Cases

- Create the smallest lambda functions possible.
- Create a development environment that allows for local development of lambda functions with short iteration times.
- 100 deploys a day :boom:

### Use case: Express API migration

You've been developing your express application for quite a while but are having some scalability problems. You want to convert to a serverless architecture, so you start to plan on migrating your api from express to the AWS Lambda, but you want to keep the same time tested file structure (middleware, controllers, services, etc).

The SAM-Webpack-Plugin plugin lets to slowly convert your express api into a serverless one. Strategy:

- define your SAM/CloudFormation template to proxy all unmatched api routes to your preexisting api.
- slowly, build up SAM endpoints using your controllers, services, and middleware functions/methods.

<!-- ### Use case: Fresh start

Your starting a most exciting project! Building a to-do app. SAM-Webpack-Plugin helps you get thats first production deploy fast but having the deployment tools build into the environment your working in. (see example for sample SAM commands) -->

## Getting Started

We recommend you have a solid knowledge base of the following technologies, AWS ApiGateway, CloudFormation Templates, AWS SAM applications, serverless architecture, and, of course, webpack and JavaScript / TypeScript.

Import `SamWebpackPlugin` into your webpack config file and add the plugin to the plugin block like so;

```js
  {
    ...,
    plugins:[
        ...,
        new SamWebpackPlugin({
            baseTemplate: './template.json'
        })
        ...
    ]
  }
```

The `template.json` file is the base SAM/CloudFront template used for all defined lambda functions. The configuration object that SamWebpackPlugin accepts has the following shape:

```ts
/**
 * @param {String} baseTemplate -- base CF/SAM template
 * @param {Object} layer -- Hashmap of of locally defined and paths to sources
 * @param {String} output -- absolute/relative path to output directory
 * @param {Boolean} verbose -- verbose logging
 */
{
   baseTemplate: String,
   layers: { [name: String]: String },
   output: String,
   verbose: Boolean
}
```

Before each lambda function, we can define our SAM config with the following;

```js
/*
@WebpackLambda({
  "Properties": {
    "Handler": "lambdaFunction.lambdaHandler",
    "Events":{
      "GetData":{
        "Type": "Api",
        "Properties": {
          "Path": "/api/v1/data",
          "Method": "get"
        }
      }
    }
  }
})
*/
```

On build, FOR EACH entry having the `@WebpackLambda` decorator, the content within each `@WebpackLambda(*)` will be parsed into the baseTemplate config. Note:

- ANY CodeUri provided within each decorate will be replaced by the plugin
- The `@WebpackLambda()` must be declared within a comment block like above
- The Config defined within each entry file will be parse into `Resources.<fileName>`. See the examples folder for more details.
- No validation on the config provided occurs, the config must comply with AWS SAM AWS::SERVERLESS::FUNCTION

## Working with local external packages

- locally defined external packages can be loaded into the deployment package by using the layers option (yes this is confusing because its not lambda layers). These locally defined external files will be copied into your deployment packages `node_modules` file.

## Limitations

- currently the project does not support the use of Lambda Layers.

## TODO

- Add plugin JSON object verification
- Explore decorator loader for @WebpackLambda
- Fill out examples (create todo app api)
- Add unit tests for action files, and test cases in a TEST_CASES.md file. This will be useful for users to understand exactly what the plugin will do.
