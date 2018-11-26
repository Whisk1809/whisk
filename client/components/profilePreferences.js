import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getSingleRecipe, updatePreferences, addToFavorites} from '../store'
// import {updatePreferences} from '../store/preferences'
// import {addToFavorites} from '../store/favorites'
import {Image, Grid} from 'semantic-ui-react'
import Loading from './loading'


class ProfilePreferences extends Component {

  render() {
    const {likedCategories, dislikedCategories} = this.props
    return (
      <div>
        <div>Your likes:</div>
          <div>Ingredients</div>

          <div>Categories</div>
            <ul>
              {likedCategories.map((el) => {
                return (
                  <li key={el.id}>
                    {el.name}
                  </li>
                )
              })}
            </ul>

        <div>Your dislikes: </div>
          <div>Ingredients</div>

          <div>Categories</div>
          <ul>
              {dislikedCategories.map((el) => {
                return (
                  <li key={el.id}>
                    {el.name}
                  </li>
                )
              })}
            </ul>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  let likes = state.preferences.likes;
  let dislikes = state.preferences.dislikes;

  const likedCategories = [];
  const dislikedCategories = [];
  likes.forEach(like =>{
    if(like.categoryId){
      const category = state.categories[like.categoryId]
      if(category){
        likedCategories.push(category)
      }
    // } else if(like.ingredientId){

    // }
    }
  })
  dislikes.forEach(dislike => {
    if(dislike.categoryId){
      const category = state.categories[dislike.categoryId]
      if(category){
        dislikedCategories.push(category)
      }
    }
  })

  return {likedCategories, dislikedCategories};
}

export default connect(mapStateToProps)(ProfilePreferences)
