const bug = require('./bug')

const aggregate = filters => ({
  bug: () => bug(filters),
})

module.exports = aggregate
