import axios from 'axios'

const defaultRequirements = []

const GET_ALL_REQUIREMENTS = 'GET_ALL_REQUIREMENTS'
const ADD_REQUIREMENT = 'ADD_REQUIREMENT'
const DELETE_REQUIREMENT = 'DELETE_REQUIREMENT'

export const setRequirements = requirements => {
  return {
    type: GET_ALL_REQUIREMENTS,
    requirements
  }
}
export const addRequirement = requirement => {
  return {
    type: ADD_REQUIREMENT,
    requirement
  }
}
export const deleteRequirement = requirement => {
  return {
    type: DELETE_REQUIREMENT,
    requirement
  }
}
export const fetchRequirements = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/requirements')
    dispatch(setRequirements(data))
  } catch (err) {
    console.error(err)
  }
}
export const postRequirement = (
  type,
  idOfRequirement,
  requirement
) => async dispatch => {
  try {
    const {data} = await axios.post(
      `/api/requirements/${type}/${idOfRequirement}`,
      requirement
    )
    dispatch(addRequirement(data))
  } catch (err) {
    console.error(err)
  }
}
export const destroyRequirement = requirementId => async dispatch => {
  try {
    const {data} = await axios.delete(`/api/requirements/${requirementId}`)
    console.log(data)
    dispatch(deleteRequirement(data))
  } catch (err) {
    console.error(err)
  }
}
export default function(state = defaultRequirements, action) {
  switch (action.type) {
    case GET_ALL_REQUIREMENTS:
      return action.requirements
    case ADD_REQUIREMENT:
      return [...state, action.requirement]

    case DELETE_REQUIREMENT:
      return state.filter(requirement => {
        if (requirement !== action.requirement) {
          return requirement
        }
      })

    default:
      return state
  }
}
