import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import React, { Component } from 'react';
import {getAllRecipes} from "../store/recipes"
import { List } from 'semantic-ui-react'

class Recipes extends Component {


  render() {
    return (
      <div>
        <List>
          {this.props.recipes.map(recipe => {
            return (
              <List.Item>{recipe.title}</List.Item>
            )
          })}
          </List>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    recipes: state.recipes
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getAllRecipes: dispatch(getAllRecipes())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Recipes);
