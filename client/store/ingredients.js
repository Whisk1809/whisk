import axios from 'axios'

const initialState = {}

const SET_INGREDIENTS = 'SET_INGREDIENTS'

export const setIngredients = ingredients => ({
  type: SET_INGREDIENTS,
  ingredients
})

export const getIngredients = ingredientsArr => async dispatch => {
  try {
    const ingrIds = ingredientsArr.join(',')
    const {data} = await axios.get(`/api/ingredients?ids=${ingrIds}`)
    dispatch(setIngredients(data))
<<<<<<< HEAD
  } catch (err) {
=======
  } catch(err) {
>>>>>>> ace7cd7813cfbf7f230720f04b9bdf0fc69f2838
    console.error(err)
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_INGREDIENTS: {
      const newState = {...state}
      action.ingredients.forEach(ingr => {
        newState[ingr.id] = ingr
      })
      return newState
    }
    default:
      return state
  }
}
