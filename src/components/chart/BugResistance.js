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
} from '@material/react-typography'
import { darken } from 'polished'
import Checkbox from '@material/react-checkbox'
import Select from '@material/react-select'

const GROUP_BY_OPTIONS = [
  { value: 'country', label: 'Country', },
  { value: 'species', label: 'Species', },
  { value: 'organism_group', label: 'Organism Group', },
  { value: 'phenotype', label: 'Phenotype', },
  { value: 'speciality', label: 'Speciality', },
  { value: 'source', label: 'Source', },
]


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
        tickValues={[0.0, 0.2, 0.4, 0.6, 0.8, 1.0]}
        orientation="top"
        style={{
          ticks: { stroke: "grey", size: 5 },
          tickLabels: { fontSize: 12, padding: 5 },
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

const BugResistance = ({ variables }) => {
  const [includeIntermediate, setIncludeIntermediate] = useState(false)
  const [groupBy, setGroupBy] = useState('country')
  return (
    <div>
      <Query query={aggQuery} variables={{ ...variables, includeIntermediate, groupBy }}>
      {({ data, loading, error }) => {
        if (loading) return <h4>Loading...</h4>
        if (error) return <h4>Ooops something went wrong, please refresh.</h4>
        return (
          <div style={{ maxWidth: '600px' }}>
            <Headline3>Bug Resistance</Headline3>
            <Caption>
              <p>The resistance of an isolate is defined as the proportion of drugs tested on it which were ineffective.</p>
              <p>The width of the coloured range represents the standard deviation of resistance across isolates.  The darker the colour, the larger the sample size.</p>
            </Caption>
            <Select
              label='Group By'
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              options={GROUP_BY_OPTIONS}
            />
            <Checkbox
              nativeControlId='include-intermediate-checkbox'
              checked={includeIntermediate}
              onChange={(e) => setIncludeIntermediate(e.target.checked)}
            />
            <label htmlFor='include-intermediate-checkbox'><Caption>include intermediate test results in definition of resistance</Caption></label>
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
  variables: PropTypes.object.isRequired,
}

export default BugResistance
