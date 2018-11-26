import axios from 'axios'

const initialState = {}

const SET_CATEGORIES = 'SET_CATEGORIES'

export const setCategories = categories => ({
  type: SET_CATEGORIES,
  categories
})

export const getCategories = categoriesArr => async dispatch => {
  try {
    const catIds = categoriesArr.join(',')
    const {data} = await axios.get(`/api/categories?ids=${catIds}`)
    dispatch(setCategories(data))
  } catch (err) {
    console.error(err)
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CATEGORIES: {
      const newState = {...state}
      action.categories.forEach(cat => {
        newState[cat.id] = cat
      })
      return newState
    }
    default:
      return state
  }
}
