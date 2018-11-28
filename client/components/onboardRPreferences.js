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
  postPreference,
  destroyPreference,
  fetchPreferences
} from '../store/preferencesOnboard'
import {searchRecipes} from '../store/recipeSearch'
import history from '../history'

class OnboardRPreferences extends Component {
  constructor() {
    super()
    this.state = {
      search: ''
    }
  }
  componentDidMount() {
    this.props.fetchPreferences()
  }
  addRequire = ingredientId => {
    console.log('event', ingredientId)
    this.props.addPreference(ingredientId)
  }
  deleteRequire = ingredientId => {
    this.props.deletePreference(ingredientId)
  }
  handleChange = evt => {
    this.setState({search: evt.target.value})
    this.props.searchRecipes(evt.target.value)
  }
  handleNext = () => {
    history.push('/preferencesCOnboard')
  }
  render() {
    return (
      <div>
        <Container textAlign="center" className="onboard-nav">
          <Header>Select recipes you prefer and do not prefer</Header>
          <Progress value="3" total="4" progress="ratio" />
          <Button large onClick={this.handleNext}>
            Next
          </Button>
        </Container>
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
              ? this.props.recipes.map(recipe => {
                  return (
                    <div className="result" key={recipe.id}>
                      <Button
                        className="button-result"
                        as="div"
                        labelPosition="left"
                      >
                        <Label className="require-label">{recipe.title}</Label>
                        <Button
                          onClick={async () => {
                            await this.props.addFalsePreference(recipe.id)
                          }}
                        >
                          <Icon name="ban" />
                        </Button>
                        <Button
                          onClick={async () => {
                            await this.props.addTruePreference(recipe.id)
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
            <Header textAlign="center">Recipes you DO NOT prefer</Header>

            {this.props.preferences
              ? this.props.preferences.map(preference => {
                  if (!preference.prefers && preference.recipeName) {
                    return (
                      <Button
                        className="button-result"
                        as="div"
                        labelPosition="left"
                        key={preference.id}
                      >
                        <Label className="require-label">
                          {preference.recipeName}
                        </Label>
                        <Button
                          onClick={() =>
                            this.props.deletePreference(preference.recipeId)
                          }
                        >
                          <Icon name="cancel" />
                        </Button>
                      </Button>
                    )
                  }
                })
              : null}
          </Container>
          <Container className="container-r">
            <Header textAlign="center">Recipes you DO prefer</Header>

            {this.props.preferences
              ? this.props.preferences.map(preference => {
                  if (preference.prefers && preference.recipeName) {
                    return (
                      <Button
                        className="button-result"
                        as="div"
                        labelPosition="left"
                        key={preference.id}
                      >
                        <Label className="require-label">
                          {preference.recipeName}
                        </Label>
                        <Button
                          onClick={() =>
                            this.props.deletePreference(preference.recipeId)
                          }
                        >
                          <Icon name="cancel" />
                        </Button>
                      </Button>
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
    recipes: state.recipeSearch,

    preferences: state.preferencesOnboard
  }
}
const mapDispatchToProps = dispatch => {
  return {
    addTruePreference: categoryId =>
      dispatch(postPreference(categoryId, true, 'recipeId')),
    addFalsePreference: categoryId =>
      dispatch(postPreference(categoryId, false, 'recipeId')),
    deletePreference: categoryId =>
      dispatch(destroyPreference(categoryId, 'categoryId')),
    fetchPreferences: () => dispatch(fetchPreferences()),
    searchRecipes: text => dispatch(searchRecipes(text))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(OnboardRPreferences)
