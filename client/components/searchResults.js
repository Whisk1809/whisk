import React, {Component} from 'react'
import {connect} from 'react-redux'
import {search} from '../store'
import {Button, Container, Icon, Item, List, Header, Grid} from 'semantic-ui-react'
import RecipeCard from './recipeCard'

//searchRecipes is an array in the store

//map state to props searchRecipes is an array.


class SearchResults extends Component {
  constructor(){
    super()
    this.state = {
      searchRecipes: []
    }
  }

  render() {

  return (
  <Container>
  <Header>Recipe Results</Header>
  <Grid columns={4}>
    {this.props.searchRecipes.map(recipe => {
      return (
        <Grid.Column key={recipe.id}>
          <RecipeCard recipe={recipe} />
        </Grid.Column>
      )
    })}
  </Grid>
</Container>

  )

  }

}

const mapStateToProps = state => ({
  searchRecipes: state.recipes.searchRecipes
})

export default connect(mapStateToProps, null)(SearchResults)
