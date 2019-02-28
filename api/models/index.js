const { knex } = require('./connection')
const StudyIsolate = require('./StudyIsolate')
const DrugTest = require('./DrugTest')

module.exports = {
  knex,
  StudyIsolate,
  DrugTest,
}
