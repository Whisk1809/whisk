import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Login,
  Signup,
  UserHome,
  Favorites,
  SingleRecipe,
  ProfilePreferences
} from './components'
import {me, getPreferences} from './store'
import Recipes from './components/recipes'
import OnboardRequirements from './components/onboardRequirements'
import singleRecipe from './components/singleRecipe'
import Search from './components/search'

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props

    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/requirements" component={OnboardRequirements} />
        {this.props.searchStatus ? (
          <Route path="/home" component={Search} />
        ) : (
          <Route path="/home" component={Recipes} />
        )}
        {isLoggedIn && (
          <Switch>
            {/* Routes placed here are only available after logging in */}

            {/* Showing the same component for both /recipes and /home is open for discussion, for single recipe /recipes/:recipeId is intuitive */}
            <Route exact path="/recipes/:recipeId" component={SingleRecipe} />
            <Route path="/recipes" component={Recipes} />
            <Route path="/favorites" component={Favorites} />
            <Route path="/preferences" component={ProfilePreferences} />
            <Route path="/home" component={Recipes} />
            <Route exact path="/" component={Recipes} />
          </Switch>
        )}
        {/* Displays our Login component as a fallback */}
        <Route component={Login} />
      </Switch>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id,
    searchStatus: state.searchStatus
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
      dispatch(getPreferences())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
