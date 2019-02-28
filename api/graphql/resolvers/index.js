const isolate = require('./isolate')

const resolvers = {
  Query: {
    isolate,
  },
}

module.exports = resolvers
