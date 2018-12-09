const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql')

const UserType = require('./types/user')

const RootQueryType = new GraphQLObjectType({
  name: 'RootQuery',

  fields: {
    user: {
      type: UserType,
      description: 'The current user, identified by an api key',
      args: {
        key: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (obj, args, { loaders }) => {
        return loaders.usersByApiKeys.load(args.key)
      },
    },
  },
})

const ncSchema = new GraphQLSchema({
  query: RootQueryType,
  // mutation: ...,
})

module.exports = ncSchema
