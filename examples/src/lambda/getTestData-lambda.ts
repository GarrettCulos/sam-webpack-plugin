/*
@WebpackLambda({
  "Properties": {
    "Handler": "ping-lambda.lambdaHandler",
    "Events":{
      "ping":{
        "Type": "Api",
        "Properties": {
          "Path": "/ping",
          "Method": "get"
        }
      }
    }
  }
})
*/
export const lambdaHandler = async (event: any, context: any) => {
  try {
    const response: any = {
      statusCode: 200,
      body: JSON.stringify('pong')
    };
    return response;
  } catch (err) {
    console.log(err);
    return { statusCode: 400, body: err };
  }
};
