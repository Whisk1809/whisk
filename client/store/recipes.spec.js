import {expect} from 'chai'
import {getAllRecipes, setRecipes} from './recipes'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import history from '../history'

const middlewares = [thunkMiddleware]
const mockStore = configureMockStore(middlewares)

describe('thunk creators', () => {
  let store
  let mockAxios

  const initialState = {recipes: []}

  beforeEach(() => {
    mockAxios = new MockAdapter(axios)
    store = mockStore(initialState)
  })

  afterEach(() => {
    mockAxios.restore()
    store.clearActions()
  })

  describe('setRecipes', () => {
    const recipes = [
      {
        title: 'Grilled Cheese',
        description: 'A really mediocre sandwich',
        prepTime: '10 minutes',
        directions:
          '1. melt butter in heated pan 2. assemble sandwich 3. Grill it!'
      },
      {
        title: 'Spaghetti',
        description: 'A really mediocre pasta',
        prepTime: '20 minutes',
        directions: '1. boil water 2. strain pasta 3. Eat it!'
      }
    ]

    it('setRecipes action creator', () => {
      const fakeUser = {email: 'Cody'}
      mockAxios.onGet('/auth/me').replyOnce(200, fakeUser)
      await store.dispatch(me())
      const actions = store.getActions()
      expect(actions[0].type).to.be.equal('GET_USER')
      expect(actions[0].user).to.be.deep.equal(fakeUser)
    })
  })

  describe('logout', () => {
    it('logout: eventually dispatches the REMOVE_USER action', async () => {
      mockAxios.onPost('/auth/logout').replyOnce(204)
      await store.dispatch(logout())
      const actions = store.getActions()
      expect(actions[0].type).to.be.equal('REMOVE_USER')
      expect(history.location.pathname).to.be.equal('/login')
    })
  })
})
