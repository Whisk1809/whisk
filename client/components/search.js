import React, {Component} from 'react'
<<<<<<< HEAD
import {connect} from 'react-redux'
import {searchRecipes} from '../store/recipeSearch'
import RecipeCard from './recipeCard'
import Slider from 'react-slick'
import {
  Grid,
  Image,
  Progress,
  Header,
  Card,
  Container,
  Button,
  List,
  Input,
  Label,
  Icon
} from 'semantic-ui-react'

class Search extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 5
    }
    console.log('recipes here', this.props.recipes)
    return (
      <Container>
        <Header>Recipe Results</Header>
        <Grid columns={4}>
          {this.props.recipes.map(recipe => {
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
const mapStateToProps = state => {
  return {
    recipes: state.recipeSearch
  }
}
const mapDispatchToProps = dispatch => {
  return {
    searchRecipes: searchParams => dispatch(searchRecipes(searchParams))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Search)
=======

class Search extends Component {
  render() {
    return <div />
  }
}

export default Sh
>>>>>>> ace7cd7813cfbf7f230720f04b9bdf0fc69f2838
