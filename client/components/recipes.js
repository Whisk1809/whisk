import {connect} from 'react-redux'
import React, {Component} from 'react'
import {getAllRecipes, getRecommendedRecipes} from '../store/recipes'
import {Card, List, Button} from 'semantic-ui-react'
import RecipeSlider from './recipeSlider'
import Loading from './loading'

class Recipes extends Component {
  componentDidMount() {
    this.props.getAllRecipes()
    this.props.getRecommendedRecipes()
  }

  render() {
    const {recipes, recommended} = this.props

    if (recipes.length && recommended.length) {
      return (
        <div>
          <RecipeSlider recipes={this.props.recipes} title="trending" />
          <p>Recommended for you</p>
          <RecipeSlider recipes={this.props.recommended} />
        </div>
      )
    } else {
      return (
        <Loading/>
      )
    }
  }
}
const mapStateToProps = state => {
  return {
    recipes: state.recipes.allRecipes,
    recommended: state.recipes.recommendedRecipes
  }
}
const mapDispatchToProps = {getRecommendedRecipes, getAllRecipes}

export default connect(mapStateToProps, mapDispatchToProps)(Recipes)
