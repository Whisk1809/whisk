import {connect} from 'react-redux'
import React, {Component} from 'react'
import {
  getRecommendedRecipes,
  getTrendingRecipes,
  getPopularRecipes
} from '../store'
import {Card, List, Button} from 'semantic-ui-react'
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
          <p>Recommended for you</p>
          <RecipeSlider recipes={recommendedRecipes} title="trending" />
          <p>Trending Recipes</p>
          <RecipeSlider recipes={trendingRecipes} />
          <p>Popular Recipes</p>
          <RecipeSlider recipes={popularRecipes} />
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
