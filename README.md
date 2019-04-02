## Getting Started

Requirements: webpack knowledge

Import `LambdaWebpackPlugin` into your webpack config file.

Add the plugin to the webpack plugin block,

```
    ...
    plugins:[
        ...
        new LambdaWebpackPlugin({
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

x add plugin options verification
x expand on jsdoc descriptions

x add docs on how plugin works.

x create git project (prettier, ci/cd to npm, example projects)

- add tests
- deploy to npm
- add plugin JSON object verification
- explore decorator loader for @WebpackLambda
