import React, {Component} from 'react'
import {Card, Icon, Image, Container, Button} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {updatePreferences, convertPrepTime} from '../store'

class RecipeCard extends Component {
  state = {
    likeActive: false,
    dislikeActive: true,
    likeButtonColor: 'blue',
    dislikeButtonColor: 'red'
  }
  handleClickLike = event => {
    event.preventDefault()
    //let button = document.getElementByName('heart')
    //button.style.backgroundColor = 'blue'
    const recipeId = this.props.recipe.id
    const prefers = true
    this.props.updatePreferences(recipeId, prefers)
    // this.setState({likeActive: !this.state.likeActive})
    this.setState({likeButtonColor: 'black'})
  }

  handleClickDislike = event => {
    event.preventDefault()
    const recipeId = this.props.recipe.id
    const prefers = false
    this.props.updatePreferences(recipeId, prefers)
    //this.setState({dislikeActive: !this.state.dislikeActive})
    this.setState({dislikeButtonColor: 'black'})
  }

  render() {
    const {likeActive, dislikeActive} = this.state
    const {recipe} = this.props
    const {id, imageUrl, title, prepTime} = recipe

    return (
      <Container>
        <Card>
          <Image src={imageUrl} as={Link} to={`/recipes/${id}`} />
          <Card.Content as={Link} to={`/recipes/${id}`}>
            <Card.Header> {title}</Card.Header>
            <Card.Meta>{convertPrepTime(recipe)}</Card.Meta>
            <Card.Description />
          </Card.Content>
          <Card.Content extra>
            <Button
              color={this.state.likeButtonColor}
              onClick={this.handleClickLike}
            >
              <Icon name="heart" />
            </Button>
            <Button
              color={this.state.dislikeButtonColor}
              onClick={this.handleClickDislike}
            >
              <Icon name="ban" />
            </Button>
          </Card.Content>
        </Card>
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  updatePreferences: (recipeId, prefers) =>
    dispatch(updatePreferences(recipeId, prefers))
})

export default connect(null, mapDispatchToProps)(RecipeCard)
