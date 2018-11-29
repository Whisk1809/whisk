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
import {searchCategories} from '../store/categorySearch'
import history from '../history'

class NotOnboardCPreferences extends Component {
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
    this.props.searchCategories(evt.target.value)
  }
  handleNext = () => {
    history.push('/home')
  }
  render() {
    return (
      <div>
        <Container textAlign="center" className="onboard-nav">
          <Header>
            Preferences: Categories
            <Header.Subheader>
              This is a great place to let us know your likes and dislikes for
              categories
            </Header.Subheader>
          </Header>
        </Container>
        <div className="requirements">
          <Container className="container-r" textAlign="center">
            {/* <Header as="h1" textAlign="center">
            If applicable: Select Ingredients You Never Want to See
          </Header> */}
            <Input
              icon="frown outline"
              iconPosition="left"
              placeholder="Search Categories..."
              size="small"
              value={this.state.search}
              onChange={this.handleChange}
            />

            {this.state.search
              ? this.props.categories.map(category => {
                  return (
                    <div className="result" key={category.id}>
                      <Button
                        className="button-result"
                        as="div"
                        labelPosition="left"
                      >
                        <Label className="require-label">{category.name}</Label>
                        <Button
                          onClick={async () => {
                            await this.props.addFalsePreference(category.id)
                          }}
                        >
                          <Icon name="thumbs down" />
                        </Button>
                        <Button
                          onClick={async () => {
                            await this.props.addTruePreference(category.id)
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
            <Header textAlign="center">Categories you DO NOT like</Header>

            {this.props.preferences
              ? this.props.preferences.map(preference => {
                  if (!preference.prefers && preference.categoryName) {
                    return (
                      <Button
                        className="button-result"
                        as="div"
                        labelPosition="left"
                        key={preference.id}
                      >
                        <Label className="require-label">
                          {preference.categoryName}
                        </Label>
                        <Button
                          onClick={() =>
                            this.props.deletePreference(preference.categoryId)
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
            <Header textAlign="center">Categories you DO like</Header>

            {this.props.preferences
              ? this.props.preferences.map(preference => {
                  if (preference.prefers && preference.categoryName) {
                    return (
                      <Button
                        className="button-result"
                        as="div"
                        labelPosition="left"
                        key={preference.id}
                      >
                        <Label className="require-label">
                          {preference.categoryName}
                        </Label>
                        <Button
                          onClick={() =>
                            this.props.deletePreference(preference.categoryId)
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
    categories: state.categorySearch,

    preferences: state.preferencesOnboard
  }
}
const mapDispatchToProps = dispatch => {
  return {
    addTruePreference: categoryId =>
      dispatch(postPreference(categoryId, true, 'categoryId')),
    addFalsePreference: categoryId =>
      dispatch(postPreference(categoryId, false, 'categoryId')),
    deletePreference: categoryId =>
      dispatch(destroyPreference(categoryId, 'categoryId')),
    fetchPreferences: () => dispatch(fetchPreferences()),
    searchCategories: text => dispatch(searchCategories(text))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(
  NotOnboardCPreferences
)
