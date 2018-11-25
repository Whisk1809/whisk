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
  Label,
  Icon
} from 'semantic-ui-react'
import {connect} from 'react-redux'
import {
  postRequirement,
  destroyRequirement,
  fetchRequirements
} from '../store/requirements'
import {searchIngredients} from '../store/ingredients'

class OnboardRequirements extends Component {
  constructor() {
    super()
    this.state = {
      search: ''
    }
  }
  componentDidMount() {
    this.props.fetchRequirements()
  }
  addRequire = ingredientId => {
    console.log('event', ingredientId)
    this.props.addRequirement(ingredientId)
  }
  deleteRequire = ingredientId => {
    this.props.deleteRequirement(ingredientId)
  }
  handleChange = evt => {
    this.setState({search: evt.target.value})
    this.props.searchIngredients(evt.target.value)
  }
  likeList = () => {}
  render() {
    return (
      <div>
        <Progress value="1" total="5" progress="ratio" />
        <div className="requirements">
          <Container className="container-r" textAlign="center">
            {/* <Header as="h1" textAlign="center">
            If applicable: Select Ingredients You Never Want to See
          </Header> */}
            <Input
              icon="frown outline"
              iconPosition="left"
              placeholder="Search Ingredients..."
              size="small"
              value={this.state.search}
              onChange={this.handleChange}
            />

            {this.state.search
              ? this.props.ingredients.map(ingredient => {
                  return (
                    <div className="result" key={ingredient.id}>
                      <Button
                        className="button-result"
                        as="div"
                        labelPosition="left"
                      >
                        <Label className="require-label">
                          {ingredient.name}
                        </Label>
                        <Button
                          onClick={async () => {
                            await this.props.addFalseRequirement(ingredient.id)
                            await this.props.fetchRequirements()
                          }}
                        >
                          <Icon name="ban" />
                        </Button>
                        <Button
                          onClick={async () => {
                            await this.props.addTrueRequirement(ingredient.id)
                            await this.props.fetchRequirements()
                          }}
                        >
                          <Icon name="heart" />
                        </Button>
                      </Button>
                    </div>
                  )
                })
              : null}
          </Container>

          <Container className="container-r">
            <Header textAlign="center">Ingredients you will NEVER See</Header>

            {this.props.requirements
              ? this.props.requirements.map(requirement => {
                  if (!requirement.requires) {
                    return (
                      <Button
                        className="button-result"
                        as="div"
                        labelPosition="left"
                        key={requirement.id}
                      >
                        <Label className="require-label">
                          {requirement.ingredientName}
                        </Label>
                        <Button>
                          <Icon name="ban" />
                        </Button>
                        <Button>
                          <Icon name="heart" />
                        </Button>
                      </Button>
                    )
                  }
                })
              : null}
          </Container>
          <Container className="container-r">
            <Header textAlign="center">Ingredients you MUST have</Header>

            {this.props.requirements
              ? this.props.requirements.map(requirement => {
                  if (requirement.requires) {
                    return (
                      <p key={requirement.id}>{requirement.ingredientName}</p>
                    )
                  }
                })
              : null}
          </Container>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    ingredients: state.ingredients,
    requirements: state.requirements
  }
}
const mapDispatchToProps = dispatch => {
  return {
    addTrueRequirement: ingredientId =>
      dispatch(postRequirement(ingredientId, true)),
    addFalseRequirement: ingredientId =>
      dispatch(postRequirement(ingredientId, false)),
    deleteRequirement: ingredientId =>
      dispatch(destroyRequirement(ingredientId)),
    fetchRequirements: () => dispatch(fetchRequirements()),
    searchIngredients: text => dispatch(searchIngredients(text))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(OnboardRequirements)
