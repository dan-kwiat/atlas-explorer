const resistance = require('./resistance')

const aggregate = filters => ({
  resistance: (args) => resistance(filters, args),
})

module.exports = aggregate
