import axios from 'axios'

const defaultPreferences = []

const GET_ALL_PREFERENCES = 'GET_ALL_PREFERENCES'
const ADD_PREFERENCE = 'ADD_PREFERENCE'
const DELETE_PREFERENCE = 'DELETE_PREFERENCE'

export const setPreferences = preferences => {
  return {
    type: GET_ALL_PREFERENCES,
    preferences
  }
}
export const addPreference = preference => {
  return {
    type: ADD_PREFERENCE,
    preference
  }
}
export const deletePreference = preference => {
  return {
    type: DELETE_PREFERENCE,
    preference
  }
}
export const fetchPreferences = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/preferencesOnboard')
    dispatch(setPreferences(data))
  } catch (err) {
    console.error(err)
  }
}
export const postPreference = (itemId, preference, type) => async dispatch => {
  try {
    const {data} = await axios.post(
      `/api/preferencesOnboard/${itemId}/${type}`,
      preference
    )

    dispatch(deletePreference(data))
    dispatch(addPreference(data))
  } catch (err) {
    console.error(err)
  }
}
export const destroyPreference = (preferenceId, type) => async dispatch => {
  try {
    const data = await axios.delete(
      `/api/preferencesOnboard/${preferenceId}/${type}`
    )

    dispatch(fetchPreferences())
  } catch (err) {
    console.error(err)
  }
}
export default function(state = defaultPreferences, action) {
  switch (action.type) {
    case GET_ALL_PREFERENCES:
      return action.preferences
    case ADD_PREFERENCE:
      return [...state, action.preference]

    case DELETE_PREFERENCE:
      return state.filter(preference => {
        if (preference.id !== action.preference.id) {
          return preference
        }
      })

    default:
      return state
  }
}
