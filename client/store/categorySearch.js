import axios from 'axios'

const defaultCategories = []

const SEARCH_CATEGORIES = 'SEARCH_CATEGORIES'

export const setCategories = categories => {
  return {
    type: SEARCH_CATEGORIES,
    categories
  }
}

export const searchCategories = searchParams => async dispatch => {
  try {
    const {data} = await axios.get(
      `/api/categorySearch?findCategory=${searchParams}`
    )
    dispatch(setCategories(data))
  } catch (err) {
    console.error(err)
  }
}

export default function(state = defaultCategories, action) {
  switch (action.type) {
    case SEARCH_CATEGORIES:
      return action.categories

    default:
      return state
  }
}
