import {connect} from 'react-redux'
import React, {Component} from 'react'
import {getAllRecipes} from '../store/recipes'
import RecipeSlider from './recipeSlider'
import Loading from './loading'

class Recipes extends Component {
  componentDidMount() {
    this.props.getAllRecipes()
  }

  render() {
    const {recipes} = this.props

    if (recipes.length) {
      return (
        <div>
          <RecipeSlider recipes={this.props.recipes} />
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
    recipes: state.recipes.allRecipes
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getAllRecipes: () => dispatch(getAllRecipes())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Recipes)
