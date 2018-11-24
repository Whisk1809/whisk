import React, {Component} from 'react'
import {Card, Icon, Image, Container, Button} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {updatePreferences} from '../store/preferences'

class RecipeCard extends Component {

  handleClickLike = (event) => {
    event.preventDefault()
    const recipeId = this.props.recipe.id
    const prefers = true
    this.props.updatePreferences(recipeId, prefers)
  }

  handleClickDislike = (event) => {
    event.preventDefault()
    const recipeId = this.props.recipe.id
    const prefers = false
    this.props.updatePreferences(recipeId, prefers)
  }

  render() {
    const {recipe} = this.props
    const {id, imageUrl, title, prepTime} = recipe

    return (
      <Container>
        <Card>
          <Image src={imageUrl} as={Link} to={`/recipes/${id}`}/>
          <Card.Content as={Link} to={`/recipes/${id}`}>
            <Card.Header> {title}</Card.Header>
            <Card.Meta>{prepTime}</Card.Meta>
            <Card.Description/>
          </Card.Content>
          <Card.Content extra>
            <Button onClick={this.handleClickLike}>
              <Icon name="heart" />
            </Button>
            <Button onClick={this.handleClickDislike}>
              <Icon name="ban" />
            </Button>
          </Card.Content>
        </Card>
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  updatePreferences: (recipeId, prefers) => dispatch(updatePreferences(recipeId, prefers))
})

export default connect(null, mapDispatchToProps)(RecipeCard)
