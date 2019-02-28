const typeDefs = `
  input IsolateFilters {
    countries: [String]
  }

  type Stats {
    mean: Float
    min: Float
    max: Float
    std: Float
  }

  type IsolateAggregateByBugBucket {
    id: ID
    name: String
    count: Int
    resistance: Stats
  }

  type IsolateAggregateByBug {
    buckets: [IsolateAggregateByBugBucket]
  }

  type IsolateAggregate {
    bug: IsolateAggregateByBug
  }

  type Isolate {
    count: Int
    aggregate: IsolateAggregate
  }

  type Query {
    isolate(filters: IsolateFilters): Isolate
  }
`

module.exports = typeDefs
