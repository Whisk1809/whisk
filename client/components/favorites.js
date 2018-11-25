import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Segment, Container, Button, Image} from 'semantic-ui-react'
import {removeFromFavorites, setFavorites} from '../store/favorites'
import {Link} from 'react-router-dom'
import Loading from './loading'

class Favorites extends Component {
  componentDidMount() {
    this.props.setFavorites()
  }

  handleRemoveClick = (event) => {
    event.preventDefault()
    const recipeId = Number(event.target.name)
    this.props.removeFromFavorites(recipeId)
  }

  render() {
    const {favorites} = this.props

    if (favorites.length) {
      return (
        <Container>
          <Segment.Group>
            {favorites.map((recipe, index) => {
              return (
                <Segment key={index}>
                  <Image src={recipe.imageUrl} size="small"/>
                  <Link to={`recipes/${recipe.id}`}>{recipe.title}</Link>
                  <Button onClick={this.handleRemoveClick} name={recipe.id}color="blue">remove</Button>
                </Segment>
              )
            })}
          </Segment.Group>
        </Container>
      )
    } else {
      return <Loading/>
    }
  }
}

const mapStateToProps = state => ({
  favorites: state.favorites
})

const mapDispatchToProps = dispatch => ({
  setFavorites: () => dispatch(setFavorites()),
  removeFromFavorites: (recipeId) => dispatch(removeFromFavorites(recipeId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Favorites)
