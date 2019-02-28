const typeDefs = `
  input IsolateFilters {
    countries: [String]
    species: [String]
    phenotypes: [String]
    organismGroups: [String]
    specialities: [String]
    sources: [String]
  }

  type Stats {
    mean: Float
    min: Float
    max: Float
    std: Float
  }

  type IsolateAggregateResistanceBucket {
    key: String
    name: String
    count: Int
    resistance: Stats
  }

  type IsolateAggregateResistance {
    buckets: [IsolateAggregateResistanceBucket]
  }

  type IsolateAggregate {
    resistance(
      groupBy: String!
      includeIntermediate: Boolean = false
    ): IsolateAggregateResistance
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
