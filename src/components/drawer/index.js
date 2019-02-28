import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import numeral from 'numeral'
import {
  DrawerHeader,
  DrawerSubtitle,
  DrawerTitle,
  DrawerContent,
} from '@material/react-drawer'
import {
  Body2
} from '@material/react-typography'
import DeviceAppropriateDrawer from './DeviceAppropriateDrawer'
import FilterChips from '../filter-chips'

const countQuery = gql`
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
    }
  }
`

const Drawer = ({
  isOpen,
  setIsDrawerOpen,
  filters,
  setFilters,
}) => (
  <DeviceAppropriateDrawer
    isOpen={isOpen}
    setIsDrawerOpen={setIsDrawerOpen}
  >
    <DrawerHeader>
      <DrawerTitle>
        Filters
      </DrawerTitle>
      <DrawerSubtitle>
        <div>{Object.keys(filters).reduce((agg, x) => (agg + filters[x].length), 0)} filters applied</div>
        <Query
          query={countQuery}
          variables={Object.keys(filters).reduce((agg, x) => ({
            ...agg,
            [x]: filters[x].map(x => x.label)
          }), {})}
        >
        {({ data, loading, error }) => {
          if (error) return <Body2>Hmmm...</Body2>
          if (loading) return <Body2>Loading...</Body2>
          return <Body2>{numeral(data.isolate.count).format('0,0')} Isolates</Body2>
        }}
        </Query>
      </DrawerSubtitle>
    </DrawerHeader>
    <DrawerContent>
      <FilterChips
        filters={filters}
        setFilters={setFilters}
      />
    </DrawerContent>
  </DeviceAppropriateDrawer>
)
Drawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsDrawerOpen: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
}

export default Drawer