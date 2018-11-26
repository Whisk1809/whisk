import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Grid, Segment, Container, Header, Button} from 'semantic-ui-react'
import Loading from './loading'


class ProfilePreferences extends Component {

  render() {
    const {likedCategories, dislikedCategories, likedIngredients, dislikedIngredients} = this.props
    return (
      <div>
        <Container>
          <Segment.Group>
              <Segment><Header as='h1' textAlign="center">Your likes</Header></Segment>
              <Segment.Group>
                <Segment><Header as="h3">Ingredients</Header></Segment>
                <Segment.Group>
                  {likedIngredients.map((el) => {
                    return (
                      <Segment key={el.id}>
                        {el.name}
                        <Button color="blue">remove</Button>
                      </Segment>
                    )
                  })}
                </Segment.Group>
                <Segment><Header as="h3">Categories</Header></Segment>
                <Segment.Group>
                  {likedCategories.map((el) => {
                    return (
                      <Segment key={el.id}>
                        {el.name}
                        <Button color="blue">remove</Button>
                      </Segment>

                    )
                  })}
                </Segment.Group>
              </Segment.Group>
            </Segment.Group>
          </Container>
          <br/>
          <Container>
            <Segment.Group>
              <Segment><Header as="h1" textAlign="center">Your dislikes</Header></Segment>
              <Segment.Group>
                <Segment><Header as="h3">Ingredients</Header></Segment>
                <Segment.Group>
                  {dislikedIngredients.map((el) => {
                    return (
                      <Segment key={el.id}>
                        {el.name}
                        <Button color="blue">remove</Button>
                      </Segment>
                    )
                  })}
                </Segment.Group>
                <Segment><Header as="h3">Categories</Header></Segment>
                <Segment.Group>
                  {dislikedCategories.map((el) => {
                    return (
                      <Segment key={el.id}>
                        {el.name}
                        <Button color="blue">remove</Button>
                      </Segment>
                    )
                  })}
                </Segment.Group>
              </Segment.Group>
          </Segment.Group>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  let likes = state.preferences.likes
  let dislikes = state.preferences.dislikes

  const likedCategories = []
  const dislikedCategories = []
  const likedIngredients = []
  const dislikedIngredients = []

  likes.forEach(like =>{
    if(like.categoryId){
      const category = state.categories[like.categoryId]
      if(category){
        likedCategories.push(category)
      }
    } else if(like.ingredientId){
      const ingredient = state.ingredients[like.ingredientId]
      if(ingredient){
        likedIngredients.push(ingredient)
      }
    }
  })

  dislikes.forEach(dislike => {
    if(dislike.categoryId){
      const category = state.categories[dislike.categoryId]
      if(category){
        dislikedCategories.push(category)
      }
    } else if(dislike.ingredientId){
      const ingredient = state.ingredients[dislike.ingredientId]
      if(ingredient){
        dislikedIngredients.push(ingredient)
      }
    }
  })

  return {likedCategories, dislikedCategories, likedIngredients, dislikedIngredients}
}

export default connect(mapStateToProps)(ProfilePreferences)
