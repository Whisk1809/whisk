const Sequelize = require('sequelize')
const db = require('../db')
const {
  likeCategory,
  likeIngredient,
  likeRecipe,
  dislikeCategory,
  dislikeIngredient,
  dislikeRecipe,
  removeCategoryRelation,
  removeIngredientRelation,
  removeRecipeRelation
} = require('../graphDb')

const Preference = db.define('preference', {
  prefers: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
})

Preference.afterCreate(preference => {
  const {userId, recipeId, ingredientId, categoryId, prefers} = preference
  let entity
  if (ingredientId) entity = {id: ingredientId, type: 'Ingredient'}
  if (recipeId) entity = {id: recipeId, type: 'Recipe'}
  if (categoryId) entity = {id: categoryId, type: 'Category'}

  if (entity.type === 'Ingredient') {
    if (prefers) likeIngredient(userId, entity.id)
    else dislikeIngredient(userId, entity.id)
  } else if (entity.type === 'Recipe') {
    if (prefers) likeRecipe(userId, entity.id)
    else dislikeRecipe(userId, entity.id)
  } else if (entity.type === 'Category') {
    if (prefers) likeCategory(userId, entity.id)
    else dislikeCategory(userId, entity.id)
  }
})

Preference.afterDestroy(preference => {
  const {userId, recipeId, ingredientId, categoryId} = preference
  let entity
  if (ingredientId) entity = {id: ingredientId, type: 'Ingredient'}
  if (recipeId) entity = {id: recipeId, type: 'Recipe'}
  if (categoryId) entity = {id: categoryId, type: 'Category'}
  if (entity.type === 'Ingredient') removeIngredientRelation(userId, entity.id)
  if (entity.type === 'Recipe') removeRecipeRelation(userId, entity.id)
  if (entity.type === 'Category') removeCategoryRelation(userId, entity.id)
})

module.exports = Preference
