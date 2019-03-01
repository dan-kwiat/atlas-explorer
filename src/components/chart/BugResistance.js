import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import {
  VictoryChart,
  VictoryBoxPlot,
  VictoryAxis,
} from 'victory'
import {
  Caption,
  Headline3,
  Subtitle1,
} from '@material/react-typography'
import { darken } from 'polished'
import Checkbox from '@material/react-checkbox'
import Select from '@material/react-select'
import FilterSuggest from '../filter-suggest'

const GROUP_BY_OPTIONS = [
  { value: 'country', label: 'Country', },
  { value: 'species', label: 'Species', },
  { value: 'organism_group', label: 'Organism Group', },
  { value: 'phenotype', label: 'Phenotype', },
  { value: 'speciality', label: 'Speciality', },
  { value: 'source', label: 'Source', },
]

const FILTER_TYPES = {
  'Country': 'countries',
  'Species': 'species',
  'Phenotype': 'phenotypes',
  'Organism Group': 'organismGroups',
  'Speciality': 'specialities',
  'Source': 'sources',
}

const aggQuery = gql`
  query aggIsolates(
    $countries: [String]
    $species: [String]
    $phenotypes: [String]
    $organismGroups: [String]
    $specialities: [String]
    $sources: [String]
    $includeIntermediate: Boolean
    $groupBy: String!
  ) {
    isolate(filters: {
      countries: $countries
      species: $species
      phenotypes: $phenotypes
      organismGroups: $organismGroups
      specialities: $specialities
      sources: $sources
    }) {
      aggregate {
        resistance(
          includeIntermediate: $includeIntermediate
          groupBy: $groupBy
        ) {
          buckets {
            key
            name
            count
            resistance {
              mean
              min
              max
              std
            }
          }
        }
      }
    }
  }
`

const BugResistanceBoxPlot = ({ data }) => {
  const indexToNames = data.reduce((agg, x, i) => ({
    ...agg,
    [data.length - i]: x.name,
  }), {})
  const maxCount = data.reduce((agg, x) => x.count > agg ? x.count : agg, 1)
  const width = 600
  return (
    <VictoryChart
      domainPadding={10}
      height={Math.max(30*data.length, 500)}
      width={width}
      padding={{ left: 200, top: 100, right: 50, bottom: 50 }}
    >
      <VictoryAxis
        dependentAxis
        tickFormat={i => indexToNames[i]}
        tickValues={data.map((x, i) => (data.length - i))}
        style={{
          tickLabels: { fontSize: 12, padding: 5 }
        }}
      />
      <VictoryAxis
        tickFormat={x => x*10%2 === 0 ? `${x*100}%` : null}
        tickValues={[...new Array(10 + 1)].map((_, i) => i/10)}
        orientation="top"
        label="Isolate Resistance"
        style={{
          ticks: {
            stroke: "grey",
            strokeWidth: 1,
            size: 5,
          },
          tickLabels: { fontSize: 12, padding: 5 },
          grid: {
            stroke: "#ddd",
            strokeWidth: 1,
          },
        }}
      />
      <VictoryBoxPlot
        horizontal
        boxWidth={4}
        whiskerWidth={0}
        data={data.map((x, i) => {
          const q1 = Math.max(x.resistance.min, x.resistance.mean - 0.5*x.resistance.std)
          const q3 = q1 + x.resistance.std
          return {
            y: data.length - i,
            min: q1, //x.resistance.min,
            max: q3, //x.resistance.max,
            q1,
            q3,
            median: x.resistance.mean,
            count: x.count,
          }
        })}
        style={{
          q1: {
            fill: x => darken(0.3*Math.log(x.count)/Math.log(maxCount), 'palevioletred'),
          },
          q3: {
            fill: x => darken(0.3*Math.log(x.count)/Math.log(maxCount), 'palevioletred'),
          },
          median: {
            stroke: 'black',
            strokeWidth: 5,
          }
        }}
      />
    </VictoryChart>
  )
}
BugResistanceBoxPlot.propTypes = {
  data: PropTypes.array.isRequired,
}

const BugResistance = ({ filters, setFilters }) => {
  const [includeIntermediate, setIncludeIntermediate] = useState(false)
  const [groupBy, setGroupBy] = useState('country')
  const variables = {
    includeIntermediate,
    groupBy,
    ...Object.keys(filters).reduce((agg, x) => ({
      ...agg,
      [x]: filters[x].map(x => x.label)
    }), {}),
  }
  return (
    <div>
      <Headline3>Bug Resistance</Headline3>
      <Subtitle1>The resistance of an isolate is defined as the proportion of drugs tested on it which were ineffective.</Subtitle1>
      <Query query={aggQuery} variables={variables}>
      {({ data, loading, error }) => {
        if (loading) return <h4>Loading...</h4>
        if (error) return <h4>Ooops something went wrong, please refresh.</h4>
        return (
          <div>
            <FilterSuggest
              onSelect={({ filterType, value, id }) => {
                const filtersVariable = FILTER_TYPES[filterType]
                if (!filtersVariable) return
                if (filters[filtersVariable].map(x => x.id).indexOf(id) > -1) return
                return setFilters({
                  ...filters,
                  [filtersVariable]: [
                    ...filters[filtersVariable],
                    { id, label: value },
                  ]
                })
              }}
            />
            <div style={{ marginBottom: '20px' }}>
              <Select
                label='Group Isolates By'
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                options={GROUP_BY_OPTIONS}
              />
              <Checkbox
                nativeControlId='include-intermediate-checkbox'
                checked={includeIntermediate}
                onChange={(e) => setIncludeIntermediate(e.target.checked)}
              />
              <label
                htmlFor='include-intermediate-checkbox'
              >
                <Caption className='pointer'>include intermediate test results in definition of resistance</Caption>
              </label>
            </div>
            <Caption>
              The width of each coloured box plot below represents the standard deviation of resistance across isolates.  The darker the colour, the larger the sample size.
            </Caption>
            <BugResistanceBoxPlot
              data={data.isolate.aggregate.resistance.buckets}
            />
          </div>
        )
      }}
      </Query>
    </div>
  )
}
BugResistance.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
}

export default BugResistance
