import React, {Component} from 'react'
import {Card, Icon, Image} from 'semantic-ui-react'

class RecipeCard extends Component {
  render() {
    const {recipe} = this.props
    return (
      <Card>
        <Image src={recipe.imageUrl} />
        <Card.Content>
          <Card.Header>{recipe.title}</Card.Header>
          <Card.Meta>{recipe.prepTime}</Card.Meta>
          <Card.Description>Direction tba</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <a>
            <Icon name="user" />
            22 Friends
          </a>
        </Card.Content>
      </Card>
    )
  }
}

export default RecipeCard
