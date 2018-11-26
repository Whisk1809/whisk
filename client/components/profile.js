import React, {Component} from 'react'
import {connect} from 'react-redux'
import {me} from '../store/user'

class Profile extends Component {
  componentDidMount() {
    this.props.getCurrentUser()
  }
  render() {
    return <div>Hello</div>
  }
}
const mapState = state => {
  return {
    user: state.user
  }
}
const mapDispatch = dispatch => {
  return {
    getCurrentUser: () => dispatch(me())
  }
}
export default connect(mapState, mapDispatch)(Profile)
