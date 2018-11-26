import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import recipes from './recipes'
import categories from './categories'
import ingredientSearch from './ingredientSearch'
import requirements from './requirements'
import favorites from './favorites'
import preferences from './preferences'

import ingredients from './ingredients'

const reducer = combineReducers({
  user,
  recipes,
  categories,
  ingredientSearch,
  requirements,
  favorites,

  preferences,

  ingredients
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
export * from './ingredients'
