const humps = require('humps')
const _ = require('lodash')

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',

  orderedFor: (rows, collection, field, singleObject = false) => {
    const data = humps.camelizeKeys(rows)
    const inGroupsOfField = _.groupBy(data, field)
    /** Check if collection exists in rows
        Match collection and row by id field
    */
    return collection.map(el => {
      const elementArray = inGroupsOfField[el]
      if (elementArray) {
        return singleObject ? elementArray[0] : elementArray
      }
      return singleObject ? {} : []
    })
  },
}
