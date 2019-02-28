import React from 'react'
import PropTypes from 'prop-types'
import {
  VictoryChart,
  VictoryLabel,
  VictoryStack,
  VictoryBar,
  VictoryTooltip,
  VictoryTheme,
  VictoryAxis,
  VictoryLegend,
} from 'victory'
import numeral from 'numeral'

const CountriesBarChart = ({ data, loading, error }) => (
  <VictoryChart
    theme={VictoryTheme.material}
    domainPadding={30}
  >
    <VictoryLabel
      x={25}
      y={24}
      text="Countries"
    />
    <VictoryAxis
      label="Country"
      standalone={false}
      tickFormat={x => null}
    />
    <VictoryAxis
      dependentAxis
      label="Isolates"
      tickFormat={x => numeral(x).format('0a')}
      style={{}}
    />
    <VictoryBar
      style={{ data: { fill: "#c43a31" } }}
      alignment="start"
      labelComponent={
        <VictoryLabel
          textAnchor="start"
          angle={-60}
        />
      }
      data={(loading || error) ? [] : data.aggIsolates.country.map(({ name, count }, i) => ({
        x: name,
        y: count,
        label: name,
      }))}
    />
  </VictoryChart>
)

export default CountriesBarChart
