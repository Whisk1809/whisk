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
  Icon,
  Form
} from 'semantic-ui-react'

class UserProfile extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
      email: '',
      phone: ''
    }
  }

  async componentDidMount() {
    await this.props.getCurrentUser()
    console.log('user here', this.props.user)
  }
  handleChange = evt => {
    console.log(evt.target)
    if (evt.target.name === 'name') {
      this.setState({name: evt.target.value})
    } else if (evt.target.name === 'email') {
      this.setState({email: evt.target.value})
    } else if (evt.target.name === 'phone') {
      this.setState({phone: evt.target.value})
    }
  }
  handleSubmit = evt => {
    evt.preventDefault()
  }
  render() {
    return (
      <Container textAlign="center">
        <Header textAlign="center">{`Welcome to your account settings, ${
          this.props.user.name
        }`}</Header>
        <div className="user-info">
          <Container>
            <List>
              <List.Item id="user-li">
                <List.Header>Username</List.Header>
                {this.props.user.name}
              </List.Item>
              <List.Item id="user-li">
                <List.Header>Email</List.Header>
                {this.props.user.email}
              </List.Item>
              <List.Item id="user-li">
                <List.Header>Phone Number</List.Header>
                {this.props.user.phone}
              </List.Item>
            </List>
          </Container>
          <Button>Edit</Button>
        </div>
        <div className="user-info">
          <Container>
            <Form>
              <List>
                <List.Item id="user-li">
                  <List.Header>Username</List.Header>
                  <Input
                    placeholder={this.props.user.name}
                    name="name"
                    onChange={this.handleChange}
                    value={this.state.name}
                  />
                </List.Item>
                <List.Item id="user-li">
                  <List.Header>Email</List.Header>
                  <Input
                    placeholder={this.props.user.email}
                    name="email"
                    onChange={this.handleChange}
                    value={this.state.email}
                  />
                </List.Item>
                <List.Item id="user-li">
                  <List.Header>Phone Number</List.Header>
                  <Input
                    placeholder={this.props.user.phone}
                    name="phone"
                    onChange={this.handleChange}
                    value={this.state.phone}
                  />
                </List.Item>
                <List.Item>
                  <Button type="submit">Submit</Button>
                </List.Item>
              </List>
            </Form>
          </Container>
        </div>
      </Container>
    )
  }
}
const mapStateToProps = state => {
  return {
    user: state.user
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getCurrentUser: () => dispatch(me())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
