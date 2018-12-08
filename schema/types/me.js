const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql')

const pgdb = require('../../database/pgdb')
const ContestType = require('./contest')

module.exports = new GraphQLObjectType({
  name: 'MeType',

  fields: {
    id: { type: GraphQLID },
    email: { type: GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    fullName: {
      type: GraphQLString,
      resolve: obj => {
        return `${obj.firstName} ${obj.lastName}`
      },
    },
    createdAt: { type: GraphQLString },
    contests: {
      type: new GraphQLList(ContestType),
      resolve(obj, args, { pgPool }) {
        return pgdb(pgPool).getContests(obj)
      },
    },
  },
})
