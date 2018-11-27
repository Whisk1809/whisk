import React, {Component} from 'react'
import {connect} from 'react-redux'
import {me, updateUser} from '../store/user'

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
  Icon,
  Form
} from 'semantic-ui-react'
class Profile extends Component {
  constructor() {
    super()
    this.state = {
      showEdit: false,
      name: '',
      email: '',
      phone: ''
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
    const element = document.getElementById('scroll-into')
    console.log(element)
    element.scrollIntoView({block: 'start', inline: 'nearest'})
  }
  handleChange = evt => {
    console.log('cirrent state', this.state)
    if (evt.target.name === 'username') {
      this.setState({name: evt.target.value})
    }
    if (evt.target.name === 'email') {
      this.setState({email: evt.target.value})
    }
    if (evt.target.name === 'phone') {
      this.setState({phone: evt.target.value})
    }
  }
  handleSubmit = evt => {
    evt.preventDefault()
    this.props.updateUser({
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone
    })
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
          <Button onClick={this.handleClick}>Edit Profile</Button>
        </Container>

        {this.state.showEdit ? (
          <Container id="scroll-into" className="user-info" textAlign="center">
            <Form onSubmit={this.handleSubmit}>
              <List>
                <List.Item id="user-info-li">
                  <List.Header>Username</List.Header>
                  <Input
                    placeholder={this.props.user.name}
                    value={this.state.name}
                    name="username"
                    onChange={this.handleChange}
                  />
                </List.Item>
                <List.Item id="user-info-li">
                  <List.Header>Email</List.Header>
                  <Input
                    placeholder={this.props.user.email}
                    value={this.state.email}
                    name="email"
                    onChange={this.handleChange}
                  />
                </List.Item>
                <List.Item id="user-info-li">
                  <List.Header>Phone</List.Header>
                  <Input
                    placeholder={this.props.user.phone}
                    value={this.state.phone}
                    name="phone"
                    onChange={this.handleChange}
                  />
                </List.Item>
                <List.Item>
                  <Button type="submit">Submit</Button>
                </List.Item>
              </List>
            </Form>
          </Container>
        ) : null}
        <Container id="scroll-into" />
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
    getCurrentUser: () => dispatch(me()),
    updateUser: userObj => dispatch(updateUser(userObj))
  }
}
export default connect(mapState, mapDispatch)(Profile)
