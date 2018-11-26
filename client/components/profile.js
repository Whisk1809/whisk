import React, {Component} from 'react'
import {connect} from 'react-redux'
import {me} from '../store/user'
import {
  Grid,
  Image,
  Progress,
  Header,
  Card,
  Container,
  Button,
  List,
  Input,
  Label,
  Icon
} from 'semantic-ui-react'
class Profile extends Component {
  constructor() {
    super()
    this.state = {
      showEdit: false
    }
  }
  componentDidMount() {
    this.props.getCurrentUser()
  }
  handleClick = () => {
    if (this.state.showEdit) {
      this.setState({showEdit: false})
    } else {
      this.setState({showEdit: true})
    }
  }
  render() {
    return (
      <div className="container-size">
        <Container className="user-info" textAlign="center">
          <List>
            <List.Item id="user-info-li">
              <List.Header>Username</List.Header>
              {this.props.user.name}
            </List.Item>
            <List.Item id="user-info-li">
              <List.Header>Email</List.Header>
              {this.props.user.email}
            </List.Item>
            <List.Item id="user-info-li">
              <List.Header>Phone</List.Header>
              {this.props.user.phone}
            </List.Item>
          </List>
          <Button>Edit Profile</Button>
        </Container>
        {this.state.showEdit ? <Container /> : null}
      </div>
    )
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
