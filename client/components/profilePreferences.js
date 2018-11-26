import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getSingleRecipe, updatePreferences, addToFavorites} from '../store'
// import {updatePreferences} from '../store/preferences'
// import {addToFavorites} from '../store/favorites'
import {Image, Grid} from 'semantic-ui-react'
import Loading from './loading'


class ProfilePreferences extends Component {

  render() {
    const {likes, dislikes} = this.props
    console.log("likes array", likes)
    console.log("dislikes array", dislikes)
    return (
      <div>
        <div>Your likes:</div>
          <div>Ingredients</div>

          <div>Categories</div>
          <ul>
            {likes.map((el, index) => {
              return (
                <li key={index}>
                  {el.recipeId}
                </li>
              )
            })}
          </ul>

        <div>Your dislikes: </div>
          <ul>
              {dislikes.map((el, index) => {
                return (
                  <li key={index}>
                    {el.recipeId}
                  </li>
                )
              })}
            </ul>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  likes: state.preferences.likes,
  dislikes: state.preferences.dislikes
})

// const mapDispatchToProps = dispatch => ({
//   setLikes: () => dispatch(setLikes()),
//   setDislikes: () => dispatch(setDislikes())
// })

export default connect(mapStateToProps)(ProfilePreferences)
