const typeDefs = `
  type Drug {
    id: Int
    name: String
    mic: String
    effective: String
  }

  type Isolate {
    Isolate_Id: Int!
    Study: String
    Species: String
    Organism_Group: String
    Country: String
    State: String
    Gender: String
    Age_Group: String
    Speciality: String
    Source: String
    In_Out_Patient: String
    Year: Int
    Phenotype: String
    drugs: [Drug]
  }

  type CountAgg {
    name: String
    count: Int
  }

  type DrugAgg {
    name: String
    count: Int
    bugResponse: [CountAgg]
    mic: [CountAgg]
  }

  type MultiAgg {
    name: String
    count: Int
    numResistant: [CountAgg]
  }

  type Filter {
    id: String
    name: String
    suggest: [String]
    filterType: String
  }

  type AggIsolate {
    totalHits: Int
    study: [CountAgg]
    species: [CountAgg]
    orgGroup: [CountAgg]
    country: [CountAgg]
    state: [CountAgg]
    gender: [CountAgg]
    ageGroup: [CountAgg]
    speciality: [CountAgg]
    source: [CountAgg]
    inOutPatient: [CountAgg]
    year: [CountAgg]
    phenotype: [CountAgg]
    drugs: [DrugAgg]
    multiResistant: [MultiAgg]
  }

  type Query {
    getIsolates(ids: [Int], countries: [String]): [Isolate]
    aggIsolates(ids: [Int], countries: [String], species: [String], orgGroups: [String]): AggIsolate
    getFilters(searchText: String): [Filter]
  }
`

module.exports = typeDefs
