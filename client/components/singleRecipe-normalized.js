import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Image, Button, Container, Icon, Item, Label} from 'semantic-ui-react'

class SingleRecipe extends Component {
  render() {
    console.log(this.props);
    const {recipes, match} = this.props
    const {title, prepTime, sourceRecipeUrl, numberOfServings, ingredientList, imageUrl} = recipes.byId[match.params.recipeId]
    return (

      <div>
        <Container>
          <Item.Group divided>
            <Item>
              <Item.Image src={imageUrl} size='large'/>
              <Item.Content>
                <Item.Header size="huge">{title}</Item.Header>
                <Item.Meta>
                  <Image src='/ingredients.png' size='tiny' />
                  <strong>Ingredients</strong>{ingredientList.map(ingredient =>
                  <div key={ingredient}>{ingredient}</div>
                  )}
                </Item.Meta>
                <Item.Meta>
                  <Image src='/serving-size.png' size='tiny' rounded/>
                  <strong>Serving Size:</strong> {numberOfServings}
                </Item.Meta>
                <Item.Meta>
                  <Image src='/cooking-time.png' size='tiny' /> <strong>Cooking Time</strong>
                  <div>{prepTime}</div>
                </Item.Meta>
              </Item.Content>
            </Item>
          </Item.Group>
          <Button as='div' labelPosition='right'>
            <Button color='green'>
              <Icon name='heart' />
            </Button>
            <Label as='a' basic color='green' pointing='left'>
              Show more of this
            </Label>
          </Button>
          <Button as='div' labelPosition='right'>
            <Button color='red'>
              <Icon name='ban' />
            </Button>
            <Label as='a' basic color='red' pointing='left'>
              Don't show me
            </Label>
          </Button>
          <Button as='div' labelPosition='right'>
            <Button color='olive'>
              <Icon name='plus' />
            </Button>
            <Label as='a' basic color='olive' pointing='left'>
              Add to My Recipe Book
            </Label>
          </Button>
          <br/>
          <a className="ui huge positive button" href={sourceRecipeUrl} style={{color: "white"}}>Get Cooking!</a>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  recipes: state.recipes.recipes
})

export default connect(mapStateToProps)(SingleRecipe)
