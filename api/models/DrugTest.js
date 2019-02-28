const { Model } = require('./connection')
const StudyIsolate = require('./StudyIsolate')

class DrugTest extends Model {
  static get tableName() {
    return 'drug_tests'
  }

  static get relationMappings() {
    return {
      study_isolate_id: {
        relation: Model.BelongsToOneRelation,
        modelClass: StudyIsolate,
        join: {
          from: 'drug_tests.study_isolate_id',
          to: 'study_isolates.id',
        }
      },
    }
  }
}

module.exports = DrugTest
