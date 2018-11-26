import axios from 'axios'

const initialState = {
  trendingRecipes: [],
  popularRecipes: [],
  newRecipes: [],
  recommendedRecipes: [],
  singleRecipe: {}
}

const GET_RECOMMENDED_RECIPES = 'GET_RECOMMENDED_RECIPES'
const GET_POPULAR_RECIPES = 'GET_POPULAR_RECIPES'
const GET_NEW_RECIPES = 'GET_NEW_RECIPES'
const GET_TRENDING_RECIPES = 'GET_TRENDING_RECIPES'
const GET_SINGLE_RECIPE = 'GET_SINGLE_RECIPE'

export const convertPrepTime = recipe => {
  const m = Math.floor(recipe.prepTimeSeconds / 60)
  const hours = Math.floor(m / 60)
  const minutes = m % 60
  if (hours === 0) return `${minutes} minutes`
  if (hours === 1 && minutes === 0) return `${hours} hour`
  if (hours === 1) return `${hours} hour and ${minutes} minutes`
  if (hours > 1 && minutes === 0) return `${hours} hours`
  return `${hours} hours and ${minutes} minutes`
}

export const setRecommendedRecipes = recommendedRecipes => {
  return {
    type: GET_RECOMMENDED_RECIPES,
    recommendedRecipes
  }
}
export const setTrendingRecipes = trendingRecipes => {
  return {
    type: GET_TRENDING_RECIPES,
    trendingRecipes
  }
}
export const setNewRecipes = newRecipes => {
  return {
    type: GET_NEW_RECIPES,
    newRecipes
  }
}
export const setPopularRecipes = popularRecipes => {
  return {
    type: GET_POPULAR_RECIPES,
    popularRecipes
  }
}

export const setSingleRecipe = singleRecipe => {
  return {
    type: GET_SINGLE_RECIPE,
    singleRecipe
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
export const getTrendingRecipes = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/recipes/trending')
    dispatch(setTrendingRecipes(data))
  } catch (err) {
    console.error(err)
  }
}
export const getNewRecipes = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/recipes/new')
    dispatch(setNewRecipes(data))
  } catch (err) {
    console.error(err)
  }
}
export const getPopularRecipes = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/recipes/popular')
    dispatch(setPopularRecipes(data))
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
    case GET_RECOMMENDED_RECIPES:
      return {...state, recommendedRecipes: action.recommendedRecipes}
    case GET_TRENDING_RECIPES:
      return {...state, trendingRecipes: action.trendingRecipes}
    case GET_NEW_RECIPES:
      return {...state, newRecipes: action.newRecipes}
    case GET_POPULAR_RECIPES:
      return {...state, popularRecipes: action.popularRecipes}
    case GET_SINGLE_RECIPE:
      return {...state, singleRecipe: action.singleRecipe}
    default:
      return state
  }
}
