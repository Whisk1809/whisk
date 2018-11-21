import axios from 'axios'

const initialState = {likes: [], dislikes: []}

const GET_USER_LIKES = 'GET_USER_LIKES'
const GET_USER_DISLIKES = 'GET_USER_DISLIKES'

export const setLikes = likes => {
  return {
    type: GET_USER_LIKES,
    likes
  }
}

export const setDislikes = dislikes => {
  return {
    type: GET_USER_DISLIKES,
    dislikes
  }
}

export const updatePreferences = async ({recipeId}) => {
  try {
    await axios.post('/api/preferences', recipeId)
  } catch (err) {
    console.error(err)
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}
