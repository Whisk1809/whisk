import React, {Component} from 'react'
import {Card, Icon, Image} from 'semantic-ui-react'

class RecipeCard extends Component {
  render() {
    const {recipe} = this.props

    const handleClick = () => {
      alert('you\'ve clicked this')
    }

    return (
      <Card>
        <Image src={recipe.imageUrl} />
        <Card.Content>
          <Card.Header onClick={handleClick}> {recipe.title}</Card.Header>
          <Card.Meta>{recipe.prepTime}</Card.Meta>
          <Card.Description>Direction tba</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <a>
            <Icon name="heart" />
          </a>
          <a>
            <Icon name="ban" />
          </a>
        </Card.Content>
      </Card>
    )
  }
}

export default RecipeCard
