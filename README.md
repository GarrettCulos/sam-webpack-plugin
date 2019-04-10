<p>
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

## Getting Started

Requirements: webpack knowledge

Import `SamWebpackPlugin` into your webpack config file.

Add the plugin to the webpack plugin block,

```
    ...
    plugins:[
        ...
        new SamWebpackPlugin({
            baseTemplate: './template.json'
        })
        ...
    ]
```

The `template.json` file is the base SAM/CloudFront template used for all defined lambda functions.
Before each lambda function, we can define our sam config with the following;

```
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
- The Config defined within each file will be parse into `Resources.<fileName>`. See the examples folder for more details.
- No validation on the config provided occurs, the config must comply with AWS SAM AWS::SERVERLESS::FUNCTION

## Working with local external packages

- user layers option to import locally defined external packages into your lambda function deployment packages.

## TODO

- add plugin JSON object verification
- explore decorator loader for @WebpackLambda
- fix locally defined external package dependency imports
