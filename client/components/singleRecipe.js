import React, {Component} from 'react'
import {connect} from 'react-redux'
import { setSingleRecipe } from '../store';
import {Image} from 'semantic-ui-react'
// import testRecipe from 'test-recipe.jpg'

class SingleRecipe extends Component {
  render() {
    const {singleRecipe} = this.props
    return (
      <Image src='test-recipe.jpg' size='medium' />
    )
  }
}

const mapStateToProps = state => ({
  singleRecipe: state.recipes.singleRecipe
})

const mapDispatchToProps = dispatch => ({
  singleRecipe: (recipeId) => dispatch(setSingleRecipe(recipeId))
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleRecipe)
