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
import {searchIngredients} from '../store/ingredientSearch'
import history from '../history'

class OnboardIPreferences extends Component {
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
    this.props.searchIngredients(evt.target.value)
  }
  handleNext = () => {
    history.push('/preferencesCOnboard')
  }
  render() {
    return (
      <div>
        <Container textAlign="center" className="onboard-nav">
          <Header>Select ingredients you prefer and do not prefer</Header>
          <Progress value="2" total="3" progress="ratio" />
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
                            await this.props.addFalsePreference(ingredient.id)
                          }}
                        >
                          <Icon name="thumbs down" />
                        </Button>
                        <Button
                          onClick={async () => {
                            await this.props.addTruePreference(ingredient.id)
                          }}
                        >
                          <Icon name="thumbs up" />
                        </Button>
                      </Button>
                    </div>
                  )
                })
              : null}
          </Container>

          <Container className="container-r">
            <Header textAlign="center">Ingredients you DO NOT prefer</Header>

            {this.props.preferences
              ? this.props.preferences.map(preference => {
                  if (!preference.prefers && preference.ingredientName) {
                    return (
                      <Button
                        className="button-result"
                        as="div"
                        labelPosition="left"
                        key={preference.id}
                      >
                        <Label className="require-label">
                          {preference.ingredientName}
                        </Label>
                        <Button
                          onClick={() =>
                            this.props.deletePreference(preference.ingredientId)
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
            <Header textAlign="center">Ingredients you DO prefer</Header>

            {this.props.preferences
              ? this.props.preferences.map(preference => {
                  if (preference.prefers && preference.ingredientName) {
                    return (
                      <Button
                        className="button-result"
                        as="div"
                        labelPosition="left"
                        key={preference.id}
                      >
                        <Label className="require-label">
                          {preference.ingredientName}
                        </Label>
                        <Button
                          onClick={() =>
                            this.props.deletePreference(preference.ingredientId)
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
    ingredients: state.ingredientSearch,

    preferences: state.preferencesOnboard
  }
}
const mapDispatchToProps = dispatch => {
  return {
    addTruePreference: ingredientId =>
      dispatch(postPreference(ingredientId, true, 'ingredientId')),
    addFalsePreference: ingredientId =>
      dispatch(postPreference(ingredientId, false, 'ingredientId')),
    deletePreference: ingredientId =>
      dispatch(destroyPreference(ingredientId, 'ingredientId')),
    fetchPreferences: () => dispatch(fetchPreferences()),
    searchIngredients: text => dispatch(searchIngredients(text))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(OnboardIPreferences)
