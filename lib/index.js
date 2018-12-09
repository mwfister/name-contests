const { nodeEnv } = require('./util')
console.log(`Running in ${nodeEnv} mode...`)

const app = require('express')()

const ncSchema = require('../schema')
const graphqlHTTP = require('express-graphql')

const DataLoader = require('dataloader')
const pg = require('pg')
const pgConfig = require('../config/pg')[nodeEnv]
const pgPool = new pg.Pool(pgConfig)
const pgdb = require('../database/pgdb')(pgPool)

const { MongoClient } = require('mongodb')
const assert = require('assert')
const mConfig = require('../config/mongo')[nodeEnv]

MongoClient.connect(mConfig.url, (err, mPool) => {
  assert.equal(err, null)

  const mdb = require('../database/mdb')(mPool)

  app.use('/graphql', (req, res) => {
    const loaders = {
      usersByIds: new DataLoader(pgdb.getUsersByIds),
      usersByApiKeys: new DataLoader(pgdb.getUsersByApiKeys),
      contestsForUserIds: new DataLoader(pgdb.getContestsForUserIds),
      namesForContestIds: new DataLoader(pgdb.getNamesForContestIds),
      totalVotesByNameIds: new DataLoader(pgdb.getTotalVotesByNameIds),
      mdb: {
        usersByIds: new DataLoader(mdb.getUsersByIds)
      },
    }
    graphqlHTTP({
      schema: ncSchema,
      graphiql: true,
      context: { pgPool, mPool, loaders },
    })(req, res)
  })

  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log('Listening on port: ', PORT)
  })
})

// Read the third argument set in the Node terminal session. (1/ Executable, 2/ Filepath)
// const query = process.argv[2]
