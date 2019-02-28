import React, { useState } from 'react'
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

const countResponses = ({ count, numResistant }, responses, percentage=false) => {
  const responseObjs = numResistant.filter(x => responses.indexOf(x.name) > -1)
  const absoluteCount = responseObjs.reduce((agg, x) => (agg + x.count), 0)
  return percentage ? (100*absoluteCount/count) : absoluteCount
}

const MultiResistanceBarChart = ({ data, loading, error }) => {
  const [asPercentage, setAsPercentage] = useState(false)
  const buckets = (error || loading) ? undefined : data.aggIsolates.multiResistant
  const legendData = [10,9,8,7,6,5,4,3,2,1,0].map(String).map(x => ({ name: x, symbol: { fill: `rgba(${255*x/10},0,0,${x/10})` }}))
  return (
    <React.Fragment>
      <div>
        <input
          type="checkbox"
          id="multi-resist-norm"
          name="percentage"
          checked={asPercentage}
          onChange={e => setAsPercentage(e.target.checked)}
        />
        <label htmlFor="multi-resist-norm">Normalise</label>
      </div>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={30}
      >
        <VictoryLabel
          x={25}
          y={24}
          text="Multiresistance"
        />
        <VictoryLegend x={0} y={50}
          orientation="horizontal"
          gutter={5}
          data={legendData}
        />
        <VictoryAxis
          label="Bugs"
          standalone={false}
          tickFormat={x => null}
        />
        <VictoryAxis
          dependentAxis
          label="Isolates"
          tickFormat={x => asPercentage ? numeral(x/100).format('0%') : numeral(x).format('0a')}
          style={{}}
        />
        <VictoryStack
          colorScale={legendData.map(x => x.symbol.fill)}
          labelComponent={
            <VictoryTooltip
            />
          }
          style={{
            data: { stroke: '#AAA', strokeWidth: 1, }
          }}
        >
          {legendData.map(band => (
            <VictoryBar
              key={band.name}
              data={buckets && buckets.map(x => {
                const y = countResponses(x, [band.name], asPercentage)
                return {
                  x: x.name,
                  label: `${x.name}\nMultiresistance: ${band.name}\nFrequency: ${asPercentage ? numeral(y/100).format('0%') : numeral(y).format('0a')}`,
                  y: y,
                }
              })}
            />
          ))}
        </VictoryStack>
      </VictoryChart>
    </React.Fragment>
  )
}

export default MultiResistanceBarChart