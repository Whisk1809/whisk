import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import React, {Component} from 'react'
import {getAllRecipes} from '../store/recipes'
import {Card, List, Button} from 'semantic-ui-react'
import RecipeSlider from './recipeSlider'

class Recipes extends Component {
  componentDidMount() {
    console.log('props', this.props)
    this.props.getAllRecipes()
  }
  render() {
    return (
      <div>
        <RecipeSlider recipes={this.props.recipes} />
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    recipes: state.allRecipes
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getAllRecipes: () => dispatch(getAllRecipes())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Recipes)
