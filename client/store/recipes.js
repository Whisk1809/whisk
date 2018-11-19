import axios from 'axios'

const defaultRecipes = {}

const GET_ALL_RECIPES = 'GET_ALL_RECIPES'
const GET_SINGLE_RECIPE = 'GET_SINGLE_RECIPE'

export const setRecipes = allRecipes => {
  return {
    type: GET_ALL_RECIPES,
    allRecipes
  }
}

export const setSingleRecipe = singleRecipe => {
  return {
    type: GET_SINGLE_RECIPE,
    singleRecipe
  }
}

export const getAllRecipes = () => async dispatch => {
  try {
    const {data} = await axios.get('http://localhost:3000/recipes')
    dispatch(setRecipes(data))
  } catch (err) {
    console.error(err)
  }
}

// uncomment this thunk when the Recipes model is ready to go!
/* export const getAllRecipes = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/recipes')
    dispatch(setRecipes(data))
  } catch (err) {
    console.error(err)
  }
} */

export const getSingleRecipe = (recipeId) => async dispatch => {
  try {
    const {data} = await axios.get(`/api/recipes/${recipeId}`)
    dispatch(setSingleRecipe(data))
  } catch (err) {
    console.error(err)
  }
}

export default function(state = defaultRecipes, action) {
  switch (action.type) {
    case GET_ALL_RECIPES:
      return {...state, recipes: action.recipes}
    case GET_SINGLE_RECIPE:
      return {...state, singleRecipe: action.setSingleRecipe}
    default:
      return state
  }
}
