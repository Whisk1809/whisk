import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import recipes from './recipes'
import favorites from './favorites'
import preferences from './preferences'
import categories from './categories'

const reducer = combineReducers({
  user,
  recipes,
  favorites,
  preferences,
  categories
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './recipes'
export * from './favorites'
export * from './preferences'
export * from './categories'
//these favorites and preferences above didn't cause any problem when they were not exported, not sure why we are exporting it
