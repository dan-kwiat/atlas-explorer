import React from 'react'
import PropTypes from 'prop-types'
import NavDrawer, {
  DrawerHeader,
  DrawerSubtitle,
  DrawerTitle,
  DrawerContent,
} from '@material/react-drawer'
import List, {
  ListItem,
  ListItemText,
  ListItemGraphic,
  ListItemMeta,
} from '@material/react-list'
import MaterialIcon from '@material/react-material-icon'

const DrawerList = ({ onItemClick }) => (
  <List>
    <ListItem onClick={onItemClick}>
      <ListItemGraphic graphic={<MaterialIcon icon='folder'/>} />
      <ListItemText primaryText='List Item 1' />
      <ListItemMeta meta='meta info' />
    </ListItem>
    <ListItem onClick={onItemClick}>
      <ListItemGraphic graphic={<MaterialIcon icon='folder'/>} />
      <ListItemText primaryText='List Item 1' />
    </ListItem>
    <ListItem onClick={onItemClick}>
      <ListItemGraphic graphic={<MaterialIcon icon='folder'/>} />
      <ListItemText primaryText='List Item 3' />
    </ListItem>
  </List>
)
DrawerList.propTypes = {
  onItemClick: PropTypes.func.isRequired,
}

const DeviceAppropriateDrawer = ({ isMobile, isOpen, setIsDrawerOpen, children }) => {
  return isMobile ? (
    <NavDrawer
      modal
      open={isOpen}
      onOpen={() => setIsDrawerOpen(true)}
      onClose={() => setIsDrawerOpen(false)}
    >
      {children}
    </NavDrawer>
  ) : (
    <NavDrawer>
      {children}
    </NavDrawer>
  )
}
DeviceAppropriateDrawer.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsDrawerOpen: PropTypes.func.isRequired,
}

const Drawer = props => (
  <DeviceAppropriateDrawer {...props}>
    <DrawerHeader>
      <DrawerTitle>
        Drawer Title
      </DrawerTitle>
      <DrawerSubtitle>
        Drawer Subtitle
      </DrawerSubtitle>
    </DrawerHeader>
    <DrawerContent>
      <DrawerList
        onItemClick={() => {
          props.isMobile && props.setIsDrawerOpen(false)
        }}
      />
      <a href='/'>test link</a>
    </DrawerContent>
  </DeviceAppropriateDrawer>
)
Drawer.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsDrawerOpen: PropTypes.func.isRequired,
}

export default Drawer