import { ApolloServer } from 'apollo-server-lambda';
import { makeExecutableSchema, mergeSchemas, IResolvers } from 'graphql-tools';
import graphql from 'graphql';

const userResolvers: IResolvers = {
  Query: {
    currentUser: async (root: any, args: any, context: any) => {
      return {
        id: 1,
        firstName: 'g',
        lastName: 'string',
        userName: 'string',
        password: 'string',
        isActive: 1,
        emailAddress: 'string',
        provider: 'string',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  }
};

const userSchema = makeExecutableSchema({
  typeDefs: `
    type Query {
      currentUser: User
    }

    type User {
      id: Int!
      firstName: String
      lastName: String
      userName: String
      password: String
      isActive: Int
      emailAddress: String
      provider: String
      createdAt: Date
      updatedAt: Date
    }
    `,
  resolvers: [userResolvers]
});

const schema = mergeSchemas({ schemas: [userSchema] });

// NOT FOR PRODUCTION
const decodeJwtToken = (token: string) => Promise.resolve({ roles: [] });

/*
@WebpackLambda({
  "Properties": {
    "Handler": "graphql-lambda.graphHandler",
    "Events":{
      "GraphQl":{
        "Type": "Api",
        "Properties": {
          "Path": "/graphql",
          "Method": "post"
        }
      }
    }
  }
})WebpackLanbda@
*/
if (graphql) {
}
const ADMIN_ROLES = { SUPER_ADMIN: 'super-admin' };
const server = new ApolloServer({
  schema,
  context: async ({ event }: any) => {
    let token = (event && event.headers && event.headers['x-access-token']) || '';
    token = Array.isArray(token) ? token[0] : token;
    const user = await decodeJwtToken(token);
    const isAdmin = user && user.roles.some((role: any) => role.name === ADMIN_ROLES.SUPER_ADMIN);
    return { user, isAdmin };
  },
  formatError: (err: any) => {
    return err;
  }
});
export const graphHandler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true
  }
});
