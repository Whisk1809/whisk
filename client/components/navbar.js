import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Redirect} from 'react-router'
import {logout} from '../store'
import {Image, Input, Button, Form, Icon} from 'semantic-ui-react'
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

  render() {
    console.log(this.props)
    return (
      <div>
        <nav>
          {this.props.isLoggedIn ? (
            <div>
              {/* The navbar will show these links after you log in */}
              <Link to="/home">
                <img src="/whisk.png" style={{width: 50}} />
              </Link>
              <Link to="/home">Home</Link>
              <a href="#" onClick={this.props.handleClick}>
                Logout
              </a>
              <Link to="/recipeBook">My Recipe Book</Link>
              <Link to="/preferences">Preferences</Link>
              <Link to="/profile">Profile</Link>
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
