import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import BugResistance from './BugResistance'
// import MultiResistanceBarChart from './MultiResistanceBarChart'
// import DrugsBarChart from './DrugsBarChart'
// import CountriesBarChart from './CountriesBarChart'
import numeral from 'numeral'
// import { Cell, Grid, Row } from '@material/react-layout-grid'

const aggQuery = gql`
  query aggIsolates(
    $countries: [String]
    $species: [String]
    $phenotypes: [String]
    $organismGroups: [String]
    $specialities: [String]
    $sources: [String]
  ) {
    isolate(filters: {
      countries: $countries
      species: $species
      phenotypes: $phenotypes
      organismGroups: $organismGroups
      specialities: $specialities
      sources: $sources
    }) {
      count
      aggregate {
        bug {
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

const Charts = ({ variables }) => (
  <Query query={aggQuery} variables={variables}>
  {({ data, loading, error }) => {
    return (
      <div style={{ opacity: loading ? 0.5 : 1, maxWidth: '600px' }}>
        {loading ? <h4>Loading...</h4> : null}
        {(loading || error) ? null : <h4>Found {numeral(data.isolate.count).format('0,0')} Isolates</h4>}
        {error && <h4>Ooops something went wrong, please refresh.</h4>}
        {(loading || error) ? null : (
          <React.Fragment>
            <BugResistance
              data={data.isolate.aggregate.bug.buckets}
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