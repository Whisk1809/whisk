import {connect} from 'react-redux'
import React, {Component} from 'react'
import {
  getRecommendedRecipes,
  getTrendingRecipes,
  getPopularRecipes,
  getNewRecipes
} from '../store'
import {Card, List, Button, Header} from 'semantic-ui-react'
import RecipeSlider from './recipeSlider'
import Loading from './loading'

class Recipes extends Component {
  componentDidMount() {
    this.props.getRecommendedRecipes()
    this.props.getTrendingRecipes()
    this.props.getPopularRecipes()
    this.props.getNewRecipes()
  }

  render() {
    const {
      trendingRecipes,
      recommendedRecipes,
      popularRecipes,
      newRecipes,
      user
    } = this.props

    if (
      trendingRecipes.length &&
      recommendedRecipes.length &&
      newRecipes.length &&
      popularRecipes.length
    ) {
      return (
        <div>
          <Header as="h2">Recommended for {user.name || user.email}</Header>
          <RecipeSlider recipes={recommendedRecipes} title="trending" />
          <Header as="h2">Popular on Whisk</Header>
          <RecipeSlider recipes={popularRecipes} />
          <Header as="h2">Trending Now</Header>
          <RecipeSlider recipes={trendingRecipes} />
          <Header as="h2">Something New</Header>
          <RecipeSlider recipes={newRecipes} />
        </div>
      )
    } else {
      return <Loading />
    }
  }
}
const mapStateToProps = ({recipes, user}) => {
  const {
    trendingRecipes,
    recommendedRecipes,
    popularRecipes,
    newRecipes
  } = recipes
  return {
    trendingRecipes,
    recommendedRecipes,
    popularRecipes,
    newRecipes,
    user
  }
}
const mapDispatchToProps = {
  getRecommendedRecipes,
  getPopularRecipes,
  getTrendingRecipes,
  getNewRecipes
}

export default connect(mapStateToProps, mapDispatchToProps)(Recipes)
