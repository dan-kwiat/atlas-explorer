import React from 'react'
import PropTypes from 'prop-types'
import {
  VictoryChart,
  VictoryBoxPlot,
  VictoryAxis,
  VictoryLabel,
} from 'victory'


const BugResistance = ({ data }) => {
  const indexToNames = data.reduce((agg, x, i) => ({
    ...agg,
    [data.length - i]: x.name,
  }), {})
  const width = 600
  return (
    <VictoryChart
      domainPadding={10}
      height={30*data.length}
      width={width}
      padding={{ left: 200, top: 100, right: 50, bottom: 50 }}
    >
      <VictoryLabel
        x={width/2}
        y={0}
        text="Bug Resistance"
        style={{
          fontSize: "40px",
          textAnchor: "middle",
          verticalAnchor: "start",
        }}
      />
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
        }))}
      />
    </VictoryChart>
  )
}
BugResistance.propTypes = {
  data: PropTypes.array.isRequired,
}

export default BugResistance
