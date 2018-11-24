import axios from 'axios'

const initialState = [];

const GET_FAVORITE_RECIPES = 'GET_FAVORITE_RECIPES'
const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES'
const REMOVE_FROM_FAVORITES = 'REMOVE_FROM_FAVORITES'

export const getFavorites = (favorites) => {
  return {
    type: GET_FAVORITE_RECIPES,
    favorites
  }
}

export const addFavorite = recipe => {
  return {
    type: ADD_TO_FAVORITES,
    recipe
  }
}

export const deleteFavorite = recipeId => {
  return {
    type: REMOVE_FROM_FAVORITES,
    recipeId
  }
}

export const addToFavorites = (recipeId) => async dispatch => {
  try {
    const {data} = await axios.post('/api/favorites', {recipeId})
    dispatch(addFavorite(data))
  } catch (err) {
    console.error(err)
  }
}

export const removeFromFavorites = (recipeId) => async dispatch => {
  try {
    await axios.delete('/api/favorites', {recipeId})
    dispatch(deleteFavorite(recipeId))
  } catch (err) {
    console.error(err)
  }
}

export const setFavorites = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/favorites')
    dispatch(getFavorites(data))
  } catch (err) {
    console.error(err)
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_FAVORITE_RECIPES:
      return action.favorites
    case ADD_TO_FAVORITES:
      return [...state, action.recipe]
    case REMOVE_FROM_FAVORITES:
    {
      let newState = [...state]
      return newState.filter(recipe => recipe.id !== action.recipeId)
    }
    default:
      return state
  }
}
