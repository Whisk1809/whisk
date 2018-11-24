import {connect} from 'react-redux'
import React, {Component} from 'react'
import {
  getRecommendedRecipes,
  getTrendingRecipes,
  getPopularRecipes
} from '../store'
import {Card, List, Button, Header} from 'semantic-ui-react'
import RecipeSlider from './recipeSlider'
import Loading from './loading'

class Recipes extends Component {
  componentDidMount() {
    this.props.getRecommendedRecipes()
    this.props.getTrendingRecipes()
    this.props.getPopularRecipes()
  }

  render() {
    const {trendingRecipes, recommendedRecipes, popularRecipes} = this.props

    if (
      trendingRecipes.length &&
      recommendedRecipes.length &&
      popularRecipes.length
    ) {
      return (
        <div>
          <Header as="h2">Recommended for You</Header>
          <RecipeSlider recipes={recommendedRecipes} title="trending" />
          <Header as="h2">Popular on Whisk</Header>
          <RecipeSlider recipes={popularRecipes} />
          <Header as="h2">Trending Now</Header>
          <RecipeSlider recipes={trendingRecipes} />
        </div>
      )
    } else {
      return <Loading />
    }
  }
}
const mapStateToProps = ({recipes}) => {
  const {trendingRecipes, recommendedRecipes, popularRecipes} = recipes
  return {
    trendingRecipes,
    recommendedRecipes,
    popularRecipes
  }
}
const mapDispatchToProps = {
  getRecommendedRecipes,
  getPopularRecipes,
  getTrendingRecipes
}

export default connect(mapStateToProps, mapDispatchToProps)(Recipes)
