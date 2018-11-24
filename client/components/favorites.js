import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Segment, Container, Button, Image} from 'semantic-ui-react'
import {deleteFavorite, setFavorites} from '../store/favorites'
import {Link} from 'react-router-dom'
import Loading from './loading'

class Favorites extends Component {
  componentDidMount() {
    this.props.setFavorites()
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
                  <Image src={recipe.imageUrl}/>
                  <Link to={`recipes/${recipe.id}`}>{recipe.title}</Link>
                  <Button color="blue">remove</Button>
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
  deleteFavorite: (recipeId) => dispatch(deleteFavorite(recipeId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Favorites)
