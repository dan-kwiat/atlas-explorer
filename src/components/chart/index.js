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
      count
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

const Charts = ({ variables }) => {
  const [includeIntermediate, setIncludeIntermediate] = useState(false)
  return (
    <div>
      <Query query={aggQuery} variables={{ ...variables, includeIntermediate }}>
      {({ data, loading, error }) => {
        return (
          <div style={{ opacity: loading ? 0.5 : 1, maxWidth: '600px' }}>
            {loading ? <h4>Loading...</h4> : null}
            {(loading || error) ? null : <h4>Found {numeral(data.isolate.count).format('0,0')} Isolates</h4>}
            {error && <h4>Ooops something went wrong, please refresh.</h4>}
            {(loading || error) ? null : (
              <React.Fragment>
                <Checkbox
                  nativeControlId='include-intermediate-checkbox'
                  checked={includeIntermediate}
                  onChange={(e) => setIncludeIntermediate(e.target.checked)}
                />
                <label htmlFor='include-intermediate-checkbox'>include intermediate outcomes in definition of resistance.</label>
                <BugResistance
                  data={data.isolate.aggregate.bug.buckets}
                />
              </React.Fragment>
            )}
          </div>
        )
      }}
      </Query>
    </div>
  )
}
Charts.propTypes = {
  variables: PropTypes.object.isRequired,
}

export default Charts