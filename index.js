import express from 'express';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import { getUsers, getUser, getUserPosts } from './resolvers/userResolvers.js';
import { getPosts, getPost, getPostAuthor } from './resolvers/postResolvers.js';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(PostType)),
      resolve: getUserPosts,
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
      resolve: getPostAuthor,
    },
  }),
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      resolve: getUsers,
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: getUser,
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(PostType)),
      resolve: getPosts,
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: getPost,
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
