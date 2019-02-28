const bug = require('./bug')

const aggregate = filters => ({
  bug: (args) => bug(filters, args),
})

module.exports = aggregate
