import _ from 'lodash'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {searchRecipes, convertPrepTime} from '../store'
import {Search, Grid, Header, Segment} from 'semantic-ui-react'
import {Redirect, withRouter} from 'react-router-dom'

const mapState = ({recipeSearch}) => ({searchResults: recipeSearch})
const mapDispatch = {searchRecipes}

class RecipeSearch extends Component {
  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () =>
    this.setState({isLoading: false, results: [], value: ''})

  handleResultSelect = (e, {result}) => {
    console.log('event: ', e)
    console.log('result: ', result)
    this.props.history.push(`/recipes/${result.id}`)
  }

  handleSearchChange = (e, {value}) => {
    this.setState({isLoading: true, value})

    setTimeout(async () => {
      if (this.state.value.length < 1) return this.resetComponent()
      await this.props.searchRecipes(value)

      this.setState({
        isLoading: false
      })
    }, 300)
  }

  render() {
    const {isLoading, value} = this.state
    const {searchResults} = this.props
    const results = searchResults.slice(0, 5).map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.imageUrl,
      description: convertPrepTime(recipe)
    }))

    return (
      <Search
        id="long-searchbar"
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={_.debounce(this.handleSearchChange, 500, {
          leading: true
        })}
        results={results}
        value={value}
        {...this.props}
      />
    )
  }
}

export default withRouter(connect(mapState, mapDispatch)(RecipeSearch))
