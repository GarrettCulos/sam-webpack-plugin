import { LambdaConnect } from 'database';
const lambdaDb = new LambdaConnect();
/*
@WebpackLambda({
  "Properties": {
    "Handler": "getUsers-lambda.lambdaHandler",
    "Events":{
      "getUsers":{
        "Type": "Api",
        "Properties": {
          "Path": "/users",
          "Method": "get"
        }
      }
    }
  }
})WebpackLanbda@
*/
export const lambdaHandler = async (event: any, context: any) => {
  try {
    console.time('query');
    const [row, fields] = await lambdaDb.query({
      query: `
        SELECT 
          \`id\` ,
          \`name\` ,
          \`email\`,
          \`created_at\`,
          \`updated_at\` 
        FROM \`user\` AS \`user\`
      `
    });
    console.timeEnd('query');
    const response: any = {
      statusCode: 200,
      body: JSON.stringify(row)
    };
    return response;
  } catch (err) {
    console.log(err);
    return { statusCode: 400, body: err };
  }
};
