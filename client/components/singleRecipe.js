import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getSingleRecipe} from '../store'
import {updatePreferences} from '../store/preferences'
import {Image, Button, Container, Icon, Item, Label} from 'semantic-ui-react'
import Loading from './loading'

class SingleRecipe extends Component {
  componentDidMount() {
    const recipeId = Number(this.props.match.params.recipeId)
    this.props.getSingleRecipe(recipeId)
  }

  handleClickLike = (event) => {
    event.preventDefault()
    const recipeId = this.props.singleRecipe.id
    const prefers = true
    this.props.updatePreferences(recipeId, prefers)
  }

  handleClickDislike = (event) => {
    event.preventDefault()
    const recipeId = this.props.singleRecipe.id
    const prefers = false
    this.props.updatePreferences({recipeId, prefers})
  }

  render() {
    const {singleRecipe} = this.props
    const {title, prepTime, sourceRecipeUrl, numberOfServings, ingredientList, imageUrl} = singleRecipe

    if(singleRecipe.id) {
      return (
        <div>
          <Container>
            <Item.Group>
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
            <Button onClick={this.handleClickLike} as='div' labelPosition='right'>
              <Button color='green'>
                <Icon name='heart' />
              </Button>
              <Label as='a' basic color='green' pointing='left'>
                Show more like this
              </Label>
            </Button>
            <Button name='false' onClick={this.handleClickDislike} as='div' labelPosition='right'>
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
                Add to My List
              </Label>
            </Button>
            <br/>
            <a className="ui huge positive button" href={sourceRecipeUrl} style={{color: "white"}}>Get Cooking!</a>
          </Container>
        </div>
      )
    } else {
      return <Loading/>
    }
  }
}

const mapStateToProps = state => ({
  singleRecipe: state.recipes.singleRecipe
})

const mapDispatchToProps = dispatch => ({
  getSingleRecipe: (recipeId) => dispatch(getSingleRecipe(recipeId)),
  updatePreferences: (recipeId, prefers) => dispatch(updatePreferences(recipeId, prefers))
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleRecipe)
