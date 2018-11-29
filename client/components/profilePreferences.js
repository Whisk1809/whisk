import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  Grid,
  Segment,
  Container,
  Header,
  Button,
  Rail,
  Sticky,
  Placeholder,
  Checkbox,
  Tab
} from 'semantic-ui-react'
import Loading from './loading'
import NotOnboardIPreferences from './notOnboardIPref'
import NotOnboardCPreferences from './notOnboardCPref'
import NotOnboardRequirements from './notOnboardReq'

class ProfilePreferences extends Component {
  constructor() {
    super()
    this.state = {
      active: true
    }
  }
  handleContextRef = contextRef => this.setState({contextRef})

  handleToggle = () => this.setState({active: !this.state.active})
  render() {
    const {active, contextRef} = this.state
    const panes = [
      {
        menuItem: 'Preferences: Ingredients',
        render: () => (
          <Tab.Pane attached={false}>
            <NotOnboardIPreferences />
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Preferences: Categories',
        render: () => (
          <Tab.Pane attached={false}>
            <NotOnboardCPreferences />
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Requirements: Ingredients',
        render: () => (
          <Tab.Pane attached={false}>
            <NotOnboardRequirements />
          </Tab.Pane>
        )
      }
    ]

    return (
      <Container textAlign="center">
        <Tab panes={panes} menu={{fluid: true, secondary: true}} />
      </Container>
    )
  }
}

const mapStateToProps = state => {
  let likes = state.preferences.likes
  let dislikes = state.preferences.dislikes

  const likedCategories = []
  const dislikedCategories = []
  const likedIngredients = []
  const dislikedIngredients = []

  likes.forEach(like => {
    if (like.categoryId) {
      const category = state.categories[like.categoryId]
      if (category) {
        likedCategories.push(category)
      }
    } else if (like.ingredientId) {
      const ingredient = state.ingredients[like.ingredientId]
      if (ingredient) {
        likedIngredients.push(ingredient)
      }
    }
  })

  dislikes.forEach(dislike => {
    if (dislike.categoryId) {
      const category = state.categories[dislike.categoryId]
      if (category) {
        dislikedCategories.push(category)
      }
    } else if (dislike.ingredientId) {
      const ingredient = state.ingredients[dislike.ingredientId]
      if (ingredient) {
        dislikedIngredients.push(ingredient)
      }
    }
  })

  return {
    likedCategories,
    dislikedCategories,
    likedIngredients,
    dislikedIngredients
  }
}

export default connect(mapStateToProps)(ProfilePreferences)
