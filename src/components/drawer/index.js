import React from 'react'
import PropTypes from 'prop-types'
import {
  DrawerHeader,
  DrawerSubtitle,
  DrawerTitle,
  DrawerContent,
} from '@material/react-drawer'
import DeviceAppropriateDrawer from './DeviceAppropriateDrawer'
import { FilterChips } from '../filter'

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
        {Object.keys(filters).reduce((agg, x) => (agg + filters[x].length), 0)} filters applied
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