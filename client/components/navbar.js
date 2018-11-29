import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import React, {Component} from 'react'
import {logout} from '../store'
import {Icon, Menu, Header} from 'semantic-ui-react'
import {searchRecipes} from '../store/recipeSearch'
import {setSearchStatus} from '../store/searchStatus'
import {RecipeSearch} from '../components'
import Search from './search'
import {withRouter, Route, Switch} from 'react-router-dom'

class Navbar extends Component {
  constructor() {
    super()
    this.state = {
      searchParams: ''
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

  handleItemClick = (evt, {name}) => {
    this.setState({activeItem: name})
  }

  render() {
    const {activeItem} = this.state
    const {user} = this.props

    return (
      <div>
        <nav>
          {this.props.isLoggedIn ? (
            <div>
              {/* The navbar will show these links after you log in */}

              <Menu>
                <Menu.Item href="/home">
                  <Header as="h3" size="huge" className="nav-icon">
                    <img src="/whisk.png" style={{width: 50}} /> Whisk
                  </Header>
                </Menu.Item>
                <Menu.Item
                  href="/recipeBook"
                  name="recipeBook"
                  active={activeItem === 'recipeBook'}
                  onClick={this.handleItemClick}
                  className="hoverable"
                >
                  My Recipe Book
                  <Icon name="bookmark" />
                </Menu.Item>
                <Menu.Item
                  href="preferences"
                  name="preferences"
                  active={activeItem === 'preferences'}
                  onClick={this.handleItemClick}
                  className="hoverable"
                >
                  My Diet
                </Menu.Item>
                <Menu.Item>
                  <RecipeSearch />
                </Menu.Item>
                <Menu.Item
                  href="/profile"
                  name="profile"
                  active={activeItem === 'profile'}
                  onClick={this.handleItemClick}
                  className="hoverable"
                >
                  {user.name ? `${user.name}'s Profile` : 'Profile'}
                </Menu.Item>
                <Menu.Item
                  href="#"
                  onClick={this.props.handleClick}
                  className="hoverable"
                >
                  Logout
                </Menu.Item>
              </Menu>
            </div>
          ) : (
            <div>
              <Menu>
                <Menu.Item href="/home">
                  <Header as="h3" size="huge" className="nav-icon">
                    <img src="/whisk.png" style={{width: 50}} /> Whisk
                  </Header>
                </Menu.Item>
                {/* The navbar will show these links before you log in */}
                <Menu.Item
                  position="right"
                  href="login"
                  name="login"
                  active={activeItem === 'login'}
                  onClick={this.handleItemClick}
                  className="hoverable"
                >
                  Login
                </Menu.Item>
                <Menu.Item
                  href="signup"
                  name="signup"
                  active={activeItem === 'signup'}
                  onClick={this.handleItemClick}
                  className="hoverable"
                >
                  Sign Up
                </Menu.Item>
              </Menu>
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
    isLoggedIn: !!state.user.id,
    user: state.user
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
