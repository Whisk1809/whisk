import React, {Component} from 'react'
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
  Label
} from 'semantic-ui-react'
import {connect} from 'react-redux'
import {postRequirement, destroyRequirement} from '../store/requirements'
import {searchIngredients} from '../store/ingredients'

class OnboardRequirements extends Component {
  constructor() {
    super()
    this.state = {
      search: ''
    }
  }
  componentDidMount() {
    console.log(this.props)
  }
  addRequire = ingredientId => {
    console.log('event', ingredientId)
    this.props.addRequirement('ingredientId', ingredientId)
  }
  deleteRequire = ingredientId => {
    this.props.deleteRequirement(ingredientId)
  }
  handleChange = evt => {
    this.setState({search: evt.target.value})
    this.props.searchIngredients(evt.target.value)
  }
  render() {
    return (
      <div>
        <Progress value="1" total="5" progress="ratio" />

        <Container textAlign="center">
          <Header as="h1" textAlign="center">
            If applicable: Select Ingredients You Never Want to See
          </Header>
          <Input
            icon="frown outline"
            iconPosition="left"
            placeholder="Search Ingredients..."
            size="massive"
            value={this.state.search}
            onChange={this.handleChange}
          />
          <Container textAlign="center">
            {this.state.search
              ? this.props.ingredients.map(ingredient => {
                  return (
                    <Container textAlign="center" key={ingredient.id}>
                      <Label>{ingredient.name}</Label>
                      <Button onClick={() => this.addRequire(ingredient.id)}>
                        +
                      </Button>
                      <Button onClick={() => this.deleteRequire(ingredient.id)}>
                        -
                      </Button>
                    </Container>
                  )
                })
              : null}
          </Container>
        </Container>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    ingredients: state.ingredients
  }
}
const mapDispatchToProps = dispatch => {
  return {
    addRequirement: (type, idOfRequirement) =>
      dispatch(postRequirement(type, idOfRequirement, true)),
    deleteRequirement: idOfRequirement =>
      dispatch(destroyRequirement(idOfRequirement)),
    searchIngredients: text => dispatch(searchIngredients(text))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(OnboardRequirements)
