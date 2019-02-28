const typeDefs = `
  input IsolateFilters {
    countries: [String]
    species: [String]
  }

  type Stats {
    mean: Float
    min: Float
    max: Float
    std: Float
  }

  type IsolateAggregateByBugBucket {
    key: String
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
