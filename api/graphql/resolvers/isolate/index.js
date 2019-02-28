const count = require('./count')
const aggregate = require('./aggregate')

function isolate(_, { filters }){
  return {
    count: () => count(filters),
    aggregate: () => aggregate(filters),
  }
}

module.exports = isolate
