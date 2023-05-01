import express from 'express';
import fetch from 'node-fetch';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import { graphqlHTTP } from 'express-graphql';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(PostType)),
      resolve: async (parent) => {
        const response = await fetch(`http://localhost:3000/posts?userId=${parent.id}`);
        const data = await response.json();
        return data;
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    author: {
      type: new GraphQLNonNull(UserType),
      resolve: async (parent) => {
        const response = await fetch(`http://localhost:3000/users/${parent.userId}`);
        const data = await response.json();
        return data;
      },
    },
  }),
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      resolve: async () => {
        const response = await fetch('http://localhost:3000/users');
        const data = await response.json();
        return data;
      },
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }) => {
        const response = await fetch(`http://localhost:3000/users/${id}`);
        const data = await response.json();
        return data;
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(PostType)),
      resolve: async () => {
        const response = await fetch('http://localhost:3000/posts');
        const data = await response.json();
        return data;
      },
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }) => {
        const response = await fetch(`http://localhost:3000/posts/${id}`);
        const data = await response.json();
        return data;
      },
    },
  },
});

const schema = new GraphQLSchema({ query: QueryType });

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  }),
);

app.listen(4000, () => {
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});
