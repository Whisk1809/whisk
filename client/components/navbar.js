import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Redirect} from 'react-router'
import {logout} from '../store'
import {Image, Input, Button, Form, Icon, Menu, Header} from 'semantic-ui-react'
import {searchRecipes} from '../store/recipeSearch'
import {setSearchStatus} from '../store/searchStatus'
import Search from './search'
import {withRouter, Route, Switch} from 'react-router-dom'

class Navbar extends Component {
  constructor() {
    super()
    this.state = {
      searchParams: '',
    }
  }
  handleChange = async evt => {
    this.setState({searchParams: evt.target.value})
    console.log('heyyy', this.state.searchParams)
    await this.props.searchRecipes(evt.target.value)
  }
  showSearch = evt => {
    if (evt.target.value !== '') {
      this.props.setSearchStatus(true)
    } else {
      this.props.setSearchStatus(false)
    }
  }

  handleItemClick = (evt, { name }) => {
    this.setState({ activeItem: name })
  }

  render() {
    const { activeItem } = this.state

    return (
      <div>
        <nav>
          {this.props.isLoggedIn ? (
            <div>
              {/* The navbar will show these links after you log in */}

              <Menu>
                <Menu.Item href='/home' secondary>
                    <Header as="h3" size="huge" className='nav-icon'>
                      <img src="/whisk.png" style={{width: 50}} /> Whisk
                    </Header>
                </Menu.Item>
                <Menu.Item href='/recipeBook' name='recipeBook' active={activeItem==='recipeBook'} onClick={this.handleItemClick}
                className='hoverable'>

                  My Recipe Book
                </Menu.Item>
                <Menu.Item href='preferences' name='preferences' active={activeItem==='preferences'} onClick={this.handleItemClick}
                className='hoverable'>
                  Preferences
                </Menu.Item>
                <Menu.Item>
                  <Form
                    onSubmit={evt => {
                      this.handleSubmit(evt)
                    }}
                  >
                    <Input
                      fluid
                      icon="search"
                      type="search"
                      placeholder="search"
                      value={this.state.searchParams}
                      onChange={evt => {
                        this.showSearch(evt)
                        this.handleChange(evt)
                      }}
                    />
                  </Form>
                </Menu.Item>
                <Menu.Item href='/profile' name='profile' active={activeItem==='profile'} onClick={this.handleItemClick}
                className='hoverable'>
                  Profile
                </Menu.Item>
                <Menu.Item href='#' onClick={this.props.handleClick}
                className='hoverable'>
                    Logout
                </Menu.Item>
              </Menu>
            </div>
          ) : (
            <div>
              <Link to="/home">
                <img src="/whisk.png" style={{width: 50}} />
              </Link>
              {/* The navbar will show these links before you log in */}
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </div>
          )}

        </nav>
        <hr />
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    },
    searchRecipes: params => dispatch(searchRecipes(params)),
    setSearchStatus: status => dispatch(setSearchStatus(status))
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
