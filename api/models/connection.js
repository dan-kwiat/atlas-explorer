const Knex = require('knex')
const { Model } = require('objection')
const config = require('../config')

const knex = Knex({
  client: 'pg',
  // useNullAsDefault: true,
  connection: {
    host : config.db.host,
    database : config.db.database,
    user : config.db.user,
    password : config.db.password,
  },
  pool: { min: 2, max: 10, },
  acquireConnectionTimeout: 10000,
})

Model.knex(knex)

module.exports = {
  knex,
  Model,
}
