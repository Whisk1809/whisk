import axios from 'axios'

const defaultCategories = []

const GET_ALL_CATEGORIES = 'GET_ALL_RECIPES'

export const setCategories = categories => {
  return {
    type: GET_ALL_CATEGORIES,
    categories
  }
}

export const fetchCategories = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/categories')
    dispatch(setCategories(data))
  } catch (err) {
    console.error(err)
  }
}

export default function(state = defaultCategories, action) {
  switch (action.type) {
    case GET_ALL_CATEGORIES:
      return action.categories

    default:
      return state
  }
}
