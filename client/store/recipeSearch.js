import axios from 'axios'

const defaultRecipes = []

const SEARCH_RECIPES = 'SEARCH_RECIPES'

export const setRecipes = recipes => {
  return {
    type: SEARCH_RECIPES,
    recipes
  }
}

export const searchRecipes = searchParams => async dispatch => {
  try {
    const {data} = await axios.get(
      `/api/recipeSearch?findRecipe=${searchParams}`
    )
    dispatch(setRecipes(data))
  } catch (err) {
    console.error(err)
  }
}

export default function(state = defaultRecipes, action) {
  switch (action.type) {
    case SEARCH_RECIPES:
      return action.recipes

    default:
      return state
  }
}
