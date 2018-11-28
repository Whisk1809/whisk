 import React, {Component} from 'react'
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


// import _ from 'lodash'
// import faker from 'faker'
// import React, { Component } from 'react'
// import { Search, Grid, Header, Segment } from 'semantic-ui-react'

// const source = _.times(5, () => ({
//   title: faker.company.companyName(),
//   description: faker.company.catchPhrase(),
//   image: faker.internet.avatar(),
//   price: faker.finance.amount(0, 100, 2, '$'),
// }))

// export class SearchExampleStandard extends Component {
//   componentWillMount() {
//     this.resetComponent()
//   }

//   resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

//   handleResultSelect = (e, { result }) => this.setState({ value: result.title })

//   handleSearchChange = (e, { value }) => {
//     this.setState({ isLoading: true, value })

//     setTimeout(() => {
//       if (this.state.value.length < 1) return this.resetComponent()

//       const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
//       const isMatch = result => re.test(result.title)

//       this.setState({
//         isLoading: false,
//         results: _.filter(source, isMatch),
//       })
//     }, 300)
//   }

//  mapStateToProps = state => {
//       return {
//         recipes: state.recipeSearch
//       }
//     }
//    mapDispatchToProps = dispatch => {
//       return {
//         searchRecipes: searchParams => dispatch(searchRecipes(searchParams))
//       }
//     }

//   render() {
//     const { isLoading, value, results } = this.state

//     return (
//       <Grid>
//         {this.props.recipes.map(recipe => {
//             return (
//               <Grid.Column key={recipe.id}>
//                 <RecipeCard recipe={recipe} />
//               </Grid.Column>
//             )
//           })}
//       </Grid>
//     )
//   }
// }
//  export default connect(mapStateToProps, mapDispatchToProps)(Search)
