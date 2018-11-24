import axios from 'axios'

const initialState = [];

const GET_FAVORITE_RECIPES = 'GET_FAVORITE_RECIPES'
const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES'

export const setFavorites = recipe => {
  return {
    type: ADD_TO_FAVORITES,
    recipe
  }
}

export const addToFavorites = (recipeId) => async dispatch => {
  try {
    const {data} = await axios.post('/api/favorites', {recipeId})
    dispatch(setFavorites(data))
  } catch (err) {
    console.error(err)
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_FAVORITES:
      return [...state, action.recipe]
    default:
      return state
  }
}
