import React, {Component} from 'react'
import {Card, Icon, Image} from 'semantic-ui-react'

class RecipeCard extends Component {
  render() {
    const {recipe} = this.props
    const {id, imageUrl, title, prepTime} = recipe

    const handleClick = () => {
      this.props.history.push(`recipes/${id}`)
    }

    return (
      <Card>
        <Image src={imageUrl} />
        <Card.Content>
          <Card.Header onClick={handleClick}> {title}</Card.Header>
          <Card.Meta>{prepTime}</Card.Meta>
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
