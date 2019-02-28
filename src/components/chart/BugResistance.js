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

const aggQuery = gql`
  query aggIsolates(
    $countries: [String]
    $species: [String]
    $phenotypes: [String]
    $organismGroups: [String]
    $specialities: [String]
    $sources: [String]
    $includeIntermediate: Boolean
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
        bug(includeIntermediate: $includeIntermediate) {
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
      height={Math.max(30*data.length, 300)}
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
        whiskerWidth={4}
        data={data.map((x, i) => ({
          y: data.length - i,
          min: x.resistance.min,
          max: x.resistance.max,
          q1: Math.max(0, x.resistance.mean - 0.5*x.resistance.std),
          q3: x.resistance.mean - 0.5*x.resistance.std < 0 ? x.resistance.std : x.resistance.mean + 0.5*x.resistance.std,
          median: x.resistance.mean,
          count: x.count,
        }))}
        style={{
          q1: {
            fill: x => darken(0.3*Math.log(x.count)/Math.log(maxCount), 'palevioletred'),
          },
          q3: {
            fill: x => darken(0.3*Math.log(x.count)/Math.log(maxCount), 'palevioletred'),
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
  return (
    <div>
      <Query query={aggQuery} variables={{ ...variables, includeIntermediate }}>
      {({ data, loading, error }) => {
        if (loading) return <h4>Loading...</h4>
        if (error) return <h4>Ooops something went wrong, please refresh.</h4>
        return (
          <div style={{ maxWidth: '600px' }}>
            <Headline3>Bug Resistance</Headline3>
            <Caption>
              <p>The resistance of an isolate is defined as the proportion of drugs tested on that isolate which were ineffective.</p>
              <p>The box plots represent the mean, standard deviation & range of resistance across isolates with the same bug.  The darker the standard deviation box, the larger the sample size.</p>
            </Caption>
            <Checkbox
              nativeControlId='include-intermediate-checkbox'
              checked={includeIntermediate}
              onChange={(e) => setIncludeIntermediate(e.target.checked)}
            />
            <label htmlFor='include-intermediate-checkbox'><Caption>include intermediate outcomes in definition of resistance.</Caption></label>
            <BugResistanceBoxPlot
              data={data.isolate.aggregate.bug.buckets}
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
