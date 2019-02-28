const { Model } = require('./connection')

class StudyIsolate extends Model {
  static get tableName() {
    return 'study_isolates'
  }
}

module.exports = StudyIsolate
