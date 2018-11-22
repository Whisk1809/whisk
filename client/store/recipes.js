import axios from 'axios'

const initialState = {allRecipes: [], recommendedRecipes: [], singleRecipe: {}}

const GET_ALL_RECIPES = 'GET_ALL_RECIPES'
const GET_RECOMMENDED_RECIPES = 'GET_RECOMMENDED_RECIPES'
const GET_SINGLE_RECIPE = 'GET_SINGLE_RECIPE'

export const setRecipes = allRecipes => {
  return {
    type: GET_ALL_RECIPES,
    allRecipes
  }
}

export const setRecommendedRecipes = recommendedRecipes => {
  return {
    type: GET_RECOMMENDED_RECIPES,
    recommendedRecipes
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
    const {data} = await axios.get('/api/recipes')
    dispatch(setRecipes(data))
  } catch (err) {
    console.error(err)
  }
}
export const getRecommendedRecipes = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/recipes/recommended')
    dispatch(setRecommendedRecipes(data))
  } catch (err) {
    console.error(err)
  }
}

export const getSingleRecipe = recipeId => async dispatch => {
  try {
    const {data} = await axios.get(`/api/recipes/${recipeId}`)
    dispatch(setSingleRecipe(data))
  } catch (err) {
    console.error(err)
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_RECIPES:
      return {...state, allRecipes: action.allRecipes}
    case GET_RECOMMENDED_RECIPES:
      return {...state, recommendedRecipes: action.recommendedRecipes}
    case GET_SINGLE_RECIPE:
      return {...state, singleRecipe: action.singleRecipe}
    default:
      return state
  }
}
