import React, {Component} from 'react'
import {connect} from 'react-redux'
import { setSingleRecipe } from '../store';

class SingleRecipe extends Component {
  render() {
    const {singleRecipe} = this.props
    return (
      <div>TBA</div>
    )
  }
}

const mapStateToProps = () => ({
  singleRecipe: StaticRange.singleRecipe
})

const mapDispatchToProps = dispatch => ({
  singleRecipe: (recipeId) => dispatch(setSingleRecipe(recipeId))
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleRecipe)
