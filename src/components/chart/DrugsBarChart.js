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

const countResponses = ({ count, bugResponse }, responses, percentage=false) => {
  const responseObjs = bugResponse.filter(x => responses.indexOf(x.name) > -1)
  const absoluteCount = responseObjs.reduce((agg, x) => (agg + x.count), 0)
  return percentage ? (100*absoluteCount/count) : absoluteCount
}

const DrugsBarChart = ({ data, loading, error }) => {
  // const buckets = (error || loading) ? [] : data.aggIsolates.drugs.sort((a, b) => {
  //   return (b.bugResponse.find(x => x.name === 'Resistant') || { count: 0 }).count - (a.bugResponse.find(x => x.name === 'Resistant') || { count: 0 }).count
  // })
  const [asPercentage, setAsPercentage] = useState(false)
  const sortResponses = ['Resistant']
  const buckets = (error || loading) ? [] : data.aggIsolates.drugs.sort((a, b) => {
    return countResponses(b, sortResponses, asPercentage) - countResponses(a, sortResponses, asPercentage)
  })
  return (
    <React.Fragment>
      <div>
        <input
          type="checkbox"
          id="drugs-bar-norm"
          name="percentage"
          checked={asPercentage}
          onChange={e => setAsPercentage(e.target.checked)}
        />
        <label htmlFor="drugs-bar-norm">Normalise</label>
      </div>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={30}
      >
        <VictoryLabel
          x={25}
          y={24}
          text="Drug Effectiveness"
        />
        <VictoryLegend x={200} y={50}
          orientation="vertical"
          gutter={5}
          data={[
            { name: "Ineffective", symbol: { fill: "tomato", } },
            { name: "Intermediate", symbol: { fill: "orange" } },
            { name: "Effective", symbol: { fill: "gold" } }
          ]}
        />
        <VictoryAxis
          label="Drugs"
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
          colorScale={["tomato", "orange", "gold"]}
          labelComponent={
            <VictoryTooltip
            />
          }
        >
          {['Resistant', 'Intermediate', 'Susceptible'].map(response => (
            <VictoryBar
              key={response}
              data={buckets.map(x => ({
                x: x.name,
                label: x.name,
                y: countResponses(x, [response], asPercentage),
              }))}
            />
          ))}
        </VictoryStack>
      </VictoryChart>
    </React.Fragment>
  )
}

export default DrugsBarChart