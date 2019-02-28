const Knex = require('knex')
const { Model } = require('objection')

const knex = Knex({
  client: 'pg',
  // useNullAsDefault: true,
  connection: {
    host : process.env.DB_HOST,
    database : process.env.DB_NAME,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
  },
  pool: { min: 2, max: 10, },
  acquireConnectionTimeout: 10000,
})

Model.knex(knex)

module.exports = {
  knex,
  Model,
}
