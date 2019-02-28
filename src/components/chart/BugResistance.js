import React from 'react'
import PropTypes from 'prop-types'
import {
  VictoryChart,
  VictoryBoxPlot,
  VictoryAxis,
  VictoryLabel,
} from 'victory'
import {
  Caption,
  Headline3,
} from '@material/react-typography'
import { darken } from 'polished'

const BugResistance = ({ data }) => {
  const indexToNames = data.reduce((agg, x, i) => ({
    ...agg,
    [data.length - i]: x.name,
  }), {})
  const maxCount = data.reduce((agg, x) => x.count > agg ? x.count : agg, 1)
  const width = 600
  return (
    <div>
      <Headline3>Bug Resistance</Headline3>
      <Caption>
        <p>The resistance of an isolate is defined as the proportion of drugs tested on that isolate which were ineffective.</p>
        <p>The box plots represent the mean, standard deviation & range of resistance across isolates with the same bug.  The darker the standard deviation box, the larger the sample size.</p>
      </Caption>
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
              fill: x => darken(0.3*Math.log(x.count)/Math.log(maxCount), 'darkseagreen'),
            },
            q3: {
              fill: x => darken(0.3*Math.log(x.count)/Math.log(maxCount), 'darkseagreen'),
            }
          }}
        />
      </VictoryChart>
    </div>
  )
}
BugResistance.propTypes = {
  data: PropTypes.array.isRequired,
}

export default BugResistance
