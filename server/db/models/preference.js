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
  },
  ingredientName: {
    type: Sequelize.STRING
  },
  categoryName: {
    type: Sequelize.STRING
  },
  recipeName: {
    type: Sequelize.STRING
  }
})

Preference.afterCreate(async preference => {
  const {userId, recipeId, ingredientId, categoryId, prefers} = preference
  let entity
  if (ingredientId) entity = {id: ingredientId, type: 'Ingredient'}
  if (recipeId) entity = {id: recipeId, type: 'Recipe'}
  if (categoryId) entity = {id: categoryId, type: 'Category'}

  if (entity.type === 'Ingredient') {
    if (prefers) await likeIngredient(userId, entity.id)
    else await dislikeIngredient(userId, entity.id)
  } else if (entity.type === 'Recipe') {
    if (prefers) await likeRecipe(userId, entity.id)
    else await dislikeRecipe(userId, entity.id)
  } else if (entity.type === 'Category') {
    if (prefers) await likeCategory(userId, entity.id)
    else await dislikeCategory(userId, entity.id)
  }
})

Preference.afterDestroy(async preference => {
  const {userId, recipeId, ingredientId, categoryId} = preference
  let entity
  if (ingredientId) entity = {id: ingredientId, type: 'Ingredient'}
  if (recipeId) entity = {id: recipeId, type: 'Recipe'}
  if (categoryId) entity = {id: categoryId, type: 'Category'}
  if (entity.type === 'Ingredient')
    await removeIngredientRelation(userId, entity.id)
  if (entity.type === 'Recipe') await removeRecipeRelation(userId, entity.id)
  if (entity.type === 'Category')
    await removeCategoryRelation(userId, entity.id)
})

module.exports = Preference
