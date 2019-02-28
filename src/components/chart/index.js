import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import MultiResistanceBarChart from './MultiResistanceBarChart'
import DrugsBarChart from './DrugsBarChart'
import CountriesBarChart from './CountriesBarChart'
import numeral from 'numeral'
import { Cell, Grid, Row } from '@material/react-layout-grid'

const aggQuery = gql`
  query aggIsolates($countries: [String]!, $species: [String]!, $orgGroups: [String]!) {
    aggIsolates(countries: $countries, species: $species, orgGroups: $orgGroups) {
      totalHits
      multiResistant {
        name
        count
        numResistant {
          name
          count
        }
      }
      drugs {
        name
        count
        bugResponse {
          name
          count
        }
      }
      country {
        name
        count
      }
    }
  }
`

const Charts = ({ variables }) => (
  <Query query={aggQuery} variables={variables}>
  {({ data, loading, error }) => {
    return (
      <div style={{ opacity: loading ? 0.5 : 1, maxWidth: '600px' }}>
        {(loading || error) ? null : <h4>{numeral(data.aggIsolates.totalHits).format('0,0')} Isolates</h4>}
        {error && <p>Ooops something went wrong</p>}
        {data && data.aggIsolates && data.aggIsolates.totalHits === 0 ? null : (
          <React.Fragment>
            <DrugsBarChart
              data={data}
              loading={loading}
              error={error}
            />
            <MultiResistanceBarChart 
              data={data}
              loading={loading}
              error={error}
            />
            <CountriesBarChart
              data={data}
              loading={loading}
              error={error}
            />
          </React.Fragment>
        )}
      </div>
    )
  }}
  </Query>
)
Charts.propTypes = {
  variables: PropTypes.object.isRequired,
}

export default Charts