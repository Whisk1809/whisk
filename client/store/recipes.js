import axios from 'axios'

const defaultRecipes = []

const GET_ALL_RECIPES = 'GET_ALL_RECIPES'

export const setRecipes = recipes => {
  return {
    type: GET_ALL_RECIPES,
    recipes
  }
}

export const getAllRecipes = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/recipes')
    dispatch(setRecipes(data))
  } catch (err) {
    console.error(err)
  }
}

export default function(state = defaultRecipes, action) {
  switch (action.type) {
    case GET_ALL_RECIPES:
      return action.recipes

    default:
      return state
  }
}
