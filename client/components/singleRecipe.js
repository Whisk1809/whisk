import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getSingleRecipe} from '../store'
import {updatePreferences, convertPrepTime} from '../store'
import {addToFavorites} from '../store/favorites'
import {Button, Container, Icon, Item, List, Header} from 'semantic-ui-react'
import Loading from './loading'

class SingleRecipe extends Component {
  constructor() {
    super()
    this.state = {
      isLikeActive: false,
      isDislikeActive: false,
      isBookmarkActive: false
    }
  }

  componentDidMount() {
    const recipeId = Number(this.props.match.params.recipeId)
    this.props.getSingleRecipe(recipeId)
  }

  handleClickLike = event => {
    event.preventDefault()
    const recipeId = this.props.singleRecipe.id
    this.setState(prevState => ({
      isLikeActive: !prevState.isLikeActive
    }))
    const prefers = true
    this.props.updatePreferences(recipeId, prefers)
    console.log('Liked this recipe')
  }

  handleClickDislike = event => {
    event.preventDefault()
    const recipeId = this.props.singleRecipe.id
    this.setState(prevState => ({
      isDislikeActive: !prevState.isDislikeActive
    }))
    const prefers = false
    this.props.updatePreferences(recipeId, prefers)
    console.log('Disliked this recipe')
  }

  handleClickFavorite = event => {
    event.preventDefault()
    const recipeId = this.props.singleRecipe.id
    this.props.addToFavorites(recipeId)
    this.setState(prevState => ({
      isBookmarkActive: !prevState.isBookmarkActive
    }))
  }

  render() {
    const {isLikeActive, isDislikeActive, isBookmarkActive} = this.state
    const {singleRecipe} = this.props
    const {
      title,
      sourceRecipeUrl,
      numberOfServings,
      ingredientList,
      imageUrl
    } = singleRecipe

    if (singleRecipe.id) {
      return (
        <div>
          <Container>
            <Header as="h2" textAlign="left">
              {title}
            </Header>
            <Item.Group>
              <Item>
                <Item.Image src={imageUrl} size="large" />
                <Item.Content>
                  <Item.Meta>
                    <List>
                      <List.Item>
                        <List.Icon name="shopping bag" />
                        <List.Content>
                          <strong>Ingredients</strong>
                          <List>
                            {ingredientList.map(ingredient => (
                              <List.Item key={ingredient}>
                                {ingredient}
                              </List.Item>
                            ))}
                          </List>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Icon name="food" />
                        <List.Content>
                          <strong>Serving Size</strong>
                          <List>
                            <List.Item> {numberOfServings}</List.Item>
                          </List>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Icon name="clock outline" />
                        <List.Content>
                          <strong>Cooking Time</strong>
                          <List>
                            <List.Item>
                              {convertPrepTime(singleRecipe)}
                            </List.Item>
                          </List>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Item.Meta>

                  <a className="ui huge button" href={sourceRecipeUrl}>
                    Get Cooking!
                  </a>
                  <br />
                  <br />
                  <Button
                    color={isLikeActive ? 'green' : 'gray'}
                    onClick={this.handleClickLike}
                    disabled={isDislikeActive}
                  >
                    <Icon name="heart" />
                  </Button>
                  <Button
                    color={isDislikeActive ? 'red' : 'gray'}
                    onClick={this.handleClickDislike}
                    disabled={isLikeActive}
                  >
                    <Icon name="ban" />
                  </Button>
                  <Button
                    color={isBookmarkActive ? 'teal' : 'gray'}
                    onClick={this.handleClickFavorite}
                  >
                    <Icon name="bookmark" />
                  </Button>
                </Item.Content>
              </Item>
            </Item.Group>
          </Container>
        </div>
      )
    } else {
      return <Loading />
    }
  }
}

const mapStateToProps = state => ({
  singleRecipe: state.recipes.singleRecipe
})

const mapDispatchToProps = dispatch => ({
  getSingleRecipe: recipeId => dispatch(getSingleRecipe(recipeId)),
  updatePreferences: (recipeId, prefers) =>
    dispatch(updatePreferences(recipeId, prefers)),
  addToFavorites: recipeId => dispatch(addToFavorites(recipeId))
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleRecipe)
