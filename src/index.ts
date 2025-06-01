import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import { graphqlUploadExpress } from 'graphql-upload';
import { typeDefs, resolvers } from './schema';
import { PrismaClient } from '@prisma/client';
import { GraphQLContext } from './context';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(json());
app.use(graphqlUploadExpress());

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
});

await server.start();

app.use('/graphql', expressMiddleware(server, {
  context: async ({ req, res }) => ({ prisma }),
}));

const httpServer = http.createServer(app);
httpServer.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000/graphql`)
);
