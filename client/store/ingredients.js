import axios from 'axios'

const defaultIngredients = []

const SEARCH_INGREDIENTS = 'SEARCH_INGREDIENTS'

export const setIngredients = ingredients => {
  return {
    type: SEARCH_INGREDIENTS,
    ingredients
  }
}

export const searchIngredients = searchParams => async dispatch => {
  try {
    const {data} = await axios.get(
      `/api/ingredients?findIngredient=${searchParams}`
    )
    dispatch(setIngredients(data))
  } catch (err) {
    console.error(err)
  }
}

export default function(state = defaultIngredients, action) {
  switch (action.type) {
    case SEARCH_INGREDIENTS:
      return action.ingredients

    default:
      return state
  }
}
