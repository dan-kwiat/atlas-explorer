import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import debounce from 'lodash.debounce'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import TextField, { HelperText, Input } from '@material/react-text-field'
import MaterialIcon from '@material/react-material-icon'
import List, {
  ListItem,
  ListItemText,
  ListItemGraphic,
} from '@material/react-list'

const dropdownQuery = gql`
  query getFilters($searchText: String) {
    getFilters(searchText: $searchText) {
      id
      name
      suggest
      filterType
    }
  }
`

const DEBOUNCE_TIME = 250

const getDefaultState = props => ({
  inputValue: props.value,
  countries: [],
  latestQuery: '',
})

class FilterInput extends Component {
  state = getDefaultState(this.props)
  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState(getDefaultState(this.props))
    }
  }
  search = debounce((q='') => {
    const queryString = q.trim()
    this.setState({
      latestQuery: queryString,
      countries: [],
    })
  }, DEBOUNCE_TIME)
  stringify = item => {
    return ''
    // if (!item || !item.__typename) {
    //   return ''
    // }
    // switch (item.__typename) {
    //   case 'country':
    //     return item.name
    //   case 'search':
    //     return item.name
    //   default:
    //     return item.name
    // }
  }
  render() {
    return (
      <Downshift
        selectedItem={null}
        inputValue={this.state.inputValue}
        onInputValueChange={inputValue => this.setState({ inputValue })}
        itemToString={this.stringify}
        defaultHighlightedIndex={0}
        onStateChange={(changes, downshift) => {
          if (changes.hasOwnProperty('selectedItem')) {
            this.search() // escape last debounced search
            const inputValue = changes.hasOwnProperty('inputValue') ? changes.inputValue : downshift.inputValue
            this.props.onSelect(changes.selectedItem, inputValue)
          }
          if (changes.type === Downshift.stateChangeTypes.changeInput) {
            this.search(changes.inputValue)
            if (downshift.highlightedIndex !== 0) {
              downshift.setHighlightedIndex(0)
            }
          }
        }}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex,
          selectedItem,
        }) => (
          <div>
            {this.props.label ? <label {...getLabelProps()}>{this.props.label}</label> : null}
            <TextField
              label='Filter by location, bug species, organism group...'
              style={{ width: '100%' }}
            >
              <Input
                {...getInputProps({
                  isOpen,
                })}
              />
            </TextField>
            {isOpen ? (
              <Query query={dropdownQuery} variables={{ searchText: this.state.latestQuery }}>
                {({ data, loading, error }) => {
                  let items
                  if (error) {
                    items = [{ name: 'Oops' }]
                  } else if (loading) {
                    items = [{ name: 'Loading...' }]
                  } else if (data.getFilters.length === 0) {
                    items = [{ name: 'No suggestions' }]
                  } else {
                    items = data.getFilters
                  }
                  return (
                    <div
                      className='filter-menu'
                      style={{
                        position: 'relative',
                      }}
                    >
                      <List
                        {...getMenuProps({ isOpen })}
                        singleSelection
                        selectedIndex={highlightedIndex}
                      >
                        {
                          items.map((item, index) => (
                            <ListItem
                              key={index}
                              {...getItemProps({
                                index,
                                item,
                              })}
                              style={{
                                opacity: loading ? 0.5 : 1,
                                // background: highlightedIndex === index ? 'red' : 'white',
                              }}
                            >
                              <ListItemGraphic
                                graphic={
                                  <MaterialIcon
                                    icon={{
                                      country: 'public',
                                      species: 'bug_report',
                                      orgGroup: 'category',
                                    }[item.filterType] || ''}
                                  />
                                }
                              />
                              <ListItemText primaryText={item.name} />
                            </ListItem>
                          ))
                        }
                      </List>
                    </div>
                  )
                }}
              </Query>
            ) : null}
          </div>
        )}
      </Downshift>
    )
  }
}
FilterInput.propTypes = {
  charityBaseQuery: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  itemTypes: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
}
FilterInput.defaultProps = {
  charityBaseQuery: {},
  label: '',
  placeholder: 'Start typing...',
  itemTypes: ['search', 'country'],
  value: '',
}

export default FilterInput
