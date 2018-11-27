let initialStatus = false

export const CHANGE_STATUS = 'CHANGE_STATUS'

export const setSearchStatus = status => ({
  type: CHANGE_STATUS,
  status
})
export default function(state = initialStatus, action) {
  switch (action.type) {
    case CHANGE_STATUS:
      return action.status

    default:
      return state
  }
}
