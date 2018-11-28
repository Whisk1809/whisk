import React, {Component} from 'react'
import {Card, Icon, Image, Container, Button, Popup} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {updatePreferences, convertPrepTime, addToFavorites} from '../store'

class RecipeCard extends Component {
  constructor() {
    super()
    this.state = {
      isLikeActive: false,
      isDislikeActive: false,
      isBookmarkActive: false
    }
  }

  handleClickLike = event => {
    event.preventDefault()
    const recipeId = this.props.recipe.id
    this.setState(prevState => ({
      isLikeActive: !prevState.isLikeActive
    }))
    const prefers = !this.state.isLikeActive
    this.props.updatePreferences(recipeId, prefers)
  }

  handleClickDislike = event => {
    event.preventDefault()
    const recipeId = this.props.recipe.id
    this.setState(prevState => ({
      isDislikeActive: !prevState.isDislikeActive
    }))
    const prefers = !this.state.isDislikeActive
    this.props.updatePreferences(recipeId, prefers)
  }

  handleClickBookmark = event => {
    event.preventDefault()
    const recipeId = this.props.recipe.id
    this.props.addToFavorites(recipeId)
    this.setState(prevState => ({
      isBookmarkActive: !prevState.isBookmarkActive
    }))
  }

  render() {
    const {isLikeActive, isDislikeActive, isBookmarkActive} = this.state
    const {recipe} = this.props
    const {id, imageUrl, title} = recipe

    return (
      <Container>
        <Card fluid>
          <Image src={imageUrl} as={Link} to={`/recipes/${id}`} />
          <Card.Content as={Link} to={`/recipes/${id}`}>
            <Card.Header> {title}</Card.Header>
            <Card.Meta><Icon name="clock outline"/>{convertPrepTime(recipe)}</Card.Meta>
            <Card.Description />
          </Card.Content>
          <Card.Content extra>
          <Popup trigger={
            <Button
              color={isLikeActive ? 'green' : undefined}
              onClick={this.handleClickLike}
              disabled={isDislikeActive}
            >
              <Icon name="thumbs up" />
            </Button>} content="Show me more recipes like this" inverted />
            <Popup trigger={
            <Button
              color={isDislikeActive ? 'red' : undefined}
              onClick={this.handleClickDislike}
              disabled={isLikeActive || isBookmarkActive}
            >
              <Icon name="thumbs down" />
            </Button>} content="Show me fewer recipes like this" inverted />
              <Popup trigger={
            <Button
              color={isBookmarkActive ? 'teal' : undefined}
              onClick={this.handleClickBookmark}
              disabled={isDislikeActive}
            >
              <Icon name="bookmark" />
            </Button>} content="Add to My Recipe Book" inverted />
          </Card.Content>
        </Card>
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  updatePreferences: (recipeId, prefers) =>
    dispatch(updatePreferences(recipeId, prefers)),
  addToFavorites: recipeId => dispatch(addToFavorites(recipeId))
})

export default connect(null, mapDispatchToProps)(RecipeCard)
