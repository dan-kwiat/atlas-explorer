const aggFieldsMap = require('./aggFieldsMap')

// The root provides the top-level API endpoints
const rootValue = esClient => ({
  getFilters: function({ searchText }) {
    const searchParams = {
      index: ['amr-atlas-filters'],
      _source: ['name', 'suggest', 'filterType'],
      from: 0,
      size: 6,
      body: {
        suggest: {
          filterSuggest : {
            prefix : searchText, 
            completion : { 
              field : 'suggest' 
            },
          },
        },
        // query: {
        //   match_phrase_prefix : {
        //     name : searchText,
        //   },
        // }
      },
    }
    return esClient.search(searchParams)
    .then(res => {
      return res.suggest.filterSuggest[0].options.map(x => ({
        ...x._source,
        id: x._id,
      }))
      // return res.hits.hits.map(x => x._source)
    })
  },
  // getSpecies: function({ searchText }) {
  //   const searchParams = {
  //     index: 'amr-atlas-species',
  //     _source: ['name'],
  //     from: 0,
  //     size: 6,
  //     body: {
  //       query: {
  //         match_phrase_prefix : {
  //           name : searchText,
  //         },
  //       },
  //     },
  //   }
  //   return esClient.search(searchParams)
  //   .then(res => {
  //     return res.hits.hits.map(x => x._source)
  //   })
  // },
  getIsolates: function ({ids, countries}) {
    const searchParams = {
      index: 'amr-atlas',
      // _source: ['Isolate_Id', 'Country'],
      from: 0,
      size: 10,
      body: {
        query: {
          bool: {
            filter: [{
              bool: {
                should: [
                  ...(ids||[]).map(id => ({
                    "term": { "Isolate_Id": id },
                  })),
                ]
              },
              bool: {
                should: [
                  ...(countries||[]).map(country => ({
                    "match_phrase": { "Country": country },
                  })),
                ]
              },
            }],
          },
        },
      },
    }
    return esClient.search(searchParams)
    .then(res => {
      return res.hits.hits.map(x => x._source)
    })
  },
  aggIsolates: function ({ids, countries, species, orgGroups}) {
    const searchParams = {
      index: 'amr-atlas',
      size: 0,
      body: {
        aggs: Object.keys(aggFieldsMap).reduce((agg, x) => ({
          ...agg,
          [x] : {
            terms : { field : aggFieldsMap[x], size : 10 },
          },
        }), {
          multiResistant : {
            terms: {
              field: 'Species',
            },
            aggs: {
              numResistant: {
                terms: {
                  field: 'resistant',
                  // "script": {
                  //   "inline": "int numResistant = 0; for (x in params._source.drugs) if (x.effective == 'Resistant') { numResistant += 1 } return numResistant"
                  // }
                }
              }
            }
          },
          drugs: {
            nested: { path: 'drugs' },
            aggs: {
              drugName: {
                filter: {
                  bool: {
                    must_not: { term: { 'drugs.effective': '' } },
                  }
                },
                aggs: {
                  effectivedrug: {
                    terms: {
                      field: 'drugs.name',
                      size : 50,
                    },
                    aggs: {
                      effectiveness: {
                        terms: {
                          field: 'drugs.effective',
                          size: 3,
                        },
                      },
                      mic: {
                        terms: {
                          field: 'drugs.mic',
                          size: 10,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        }),
        query: {
          bool: {
            filter: [
              {
                bool: {
                  should: [
                    ...(ids||[]).map(id => ({
                      "term": { "Isolate_Id": id },
                    })),
                  ]
                }
              },
              {
                bool: {
                  should: [
                    ...(countries||[]).map(x => ({
                      "match_phrase": { "Country": x },
                    })),
                  ]
                }
              },
              {
                bool: {
                  should: [
                    ...(species||[]).map(x => ({
                      "match_phrase": { "Species": x },
                    })),
                  ]
                }
              },
              {
                bool: {
                  should: [
                    ...(orgGroups||[]).map(x => ({
                      "match_phrase": { "Organism_Group": x },
                    })),
                  ]
                }
              },
            ],
          },
        },
      },
    }
    return esClient.search(searchParams)
    .then(res => {
      const drugAggs = res.aggregations.drugs.drugName.effectivedrug.buckets.map(x => ({
        name: x.key,
        count: x.doc_count,
        bugResponse: x.effectiveness.buckets.map(x => ({
          name: x.key,
          count: x.doc_count,
        })),
        mic: x.mic.buckets.map(x => ({
          name: x.key,
          count: x.doc_count,
        })),
      }))
      const multiResistant = res.aggregations.multiResistant.buckets.map(x => ({
        name: x.key,
        count: x.doc_count,
        numResistant: x.numResistant.buckets.map(x => ({
          name: x.key,
          count: x.doc_count,
        }))
      }))
      // const { resistant, intermediate, susceptible } = res.aggregations.drugs3
      // const drugs = resistant.map
      // console.log(res.aggregations.drugs3.resistant.drug.buckets)
      // console.log(res.aggregations.drugs3.intermediate.drug.buckets)
      // console.log(res.aggregations.drugs3.susceptible.drug.buckets)

      // console.log(res.aggregations.drugs2.drugName.effectivedrug.buckets.map(x => ({
      //   drug: x.key,
      //   effectiveness: x.effectiveness.buckets.map(({key, doc_count}) => `${key}-${doc_count}`).join(', '),
      // })))
      // console.log(res.aggregations.drugs3.drugName.buckets.map(x => ({
      //   drug: x.key,
      //   effectiveness: x.effectiveness.buckets.map(({key, doc_count}) => `${key}-${doc_count}`).join(', '),
      // })))
      return Object.keys(aggFieldsMap).reduce((agg, x) => ({
        ...agg,
        [x]: [
          ...res.aggregations[x].buckets.map(({ key, doc_count }) => ({
            name: key,
            count: doc_count,
          })),
          {
            name: 'Other',
            count: res.aggregations[x].sum_other_doc_count,
          }
        ].filter(x => x.count > 0),
      }), {
        drugs: drugAggs,
        multiResistant: multiResistant,
        totalHits: res.hits.total,
      })
    })
  },
})

module.exports = rootValue