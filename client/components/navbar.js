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

  handleItemClick = (evt, { name }) => {
    this.setState({ activeItem: name })
  }

  render() {
    console.log(this.props)
    const { activeItem } = this.state
    return (
      <div>
        <nav>
          {this.props.isLoggedIn ? (
            <div>
              {/* The navbar will show these links after you log in */}

              <Menu>
                <Menu.Item>
                  <Link to="/home">
                    <Header as="h2" size="huge">
                      <img src="/whisk.png" style={{width: 50}} /> Whisk
                    </Header>
                  </Link>
                </Menu.Item>
                <Menu.Item>
                <a href="#" onClick={this.props.handleClick}>
                  Logout
                </a>
                </Menu.Item>
                <Menu.Item>
                  <Link to="/recipeBook">My Recipe Book</Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to="/preferences">Preferences</Link>
                </Menu.Item>
                <Menu.Item position='right'>
                  <Link to="/profile">Profile</Link>
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
          <Form
            onSubmit={evt => {
              this.handleSubmit(evt)
            }}
          >
            <Input
              placeholder="search"
              value={this.state.searchParams}
              onChange={evt => {
                this.showSearch(evt)
                this.handleChange(evt)
              }}
            />
            <Button type="submit">
              <Icon name="search" />
            </Button>
          </Form>
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
