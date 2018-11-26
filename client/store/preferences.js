import axios from 'axios'
import {getCategories} from './categories'

const initialState = {likes: [], dislikes: []}

const SET_USER_LIKES = 'GET_USER_LIKES'
const SET_USER_DISLIKES = 'GET_USER_DISLIKES'
const REMOVE_FROM_PREFERENCES = 'REMOVE_FROM_PREFERENCES'
const UPDATE_SINGLE_PREFERENCE = 'UPDATE_SINGLE_PREFERENCE'

export const setLikes = likes => {
  return {
    type: SET_USER_LIKES,
    likes
  }
}

export const setDislikes = dislikes => {
  return {
    type: SET_USER_DISLIKES,
    dislikes
  }
}

export const updateSinglePreference = data => {
  return {
    type: UPDATE_SINGLE_PREFERENCE,
    data
  }
}

export const updatePreferences = (recipeId, prefers) => async dispatch => {
  try {
    const {data} = await axios.post('/api/preferences', {recipeId, prefers})
    dispatch(updateSinglePreference(data))
  } catch (err) {
    console.error(err)
  }
}

export const getPreferences = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/preferences')
    let categoryIds = [];
    let ingredientIds = [];
    data.forEach(datum => {
      if(datum.categoryId){
        categoryIds.push(datum.categoryId)
      } else if (datum.ingredientId) {
        ingredientIds.push(datum.ingredientId)
      }
    })

    //call thunks on categoryIds and ingredientIds
    dispatch(getCategories(categoryIds))

    const dataLikes = data.filter(datum =>
      datum.prefers)
    const dataDislikes = data.filter(datum => !datum.prefers)
    dispatch(setLikes(dataLikes))
    dispatch(setDislikes(dataDislikes))
  } catch (err) {
    console.error(err)
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_LIKES:
      return {...state, likes: action.likes}
    case SET_USER_DISLIKES:
    return {...state, dislikes: action.dislikes}
    case UPDATE_SINGLE_PREFERENCE:
    {
      let likes, dislikes;
      if (action.data.prefers) {
        dislikes = state.dislikes.filter(el => el.recipeId !== action.data.recipeId)
        likes = [...state.likes, action.data]
      } else {
        likes = state.likes.filter(el => el.recipeId !== action.data.recipeId)
        dislikes = [...state.dislikes, action.data]
      }
      return {...state, likes, dislikes};
    }
    default:
      return state
  }
}
