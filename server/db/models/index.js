const User = require('./user')
const Recipe = require('./recipe')
const Ingredient = require('./ingredient')
const Equipment = require('./equipment')
const Tag = require('./tag')

Recipe.hasMany(Tag, {through: 'RecipeTags'})
Tag.hasMany(Recipe, {through: 'RecipeTags'})
Recipe.hasMany(Ingredient, {through: 'RecipeIngredients'})
Ingredient.hasMany(Recipe, {through: 'RecipeIngredients'})
Equipment.hasMany(Recipe, {through: 'RecipeEquipment'})
Recipe.hasMany(Equipment, {through: 'RecipeEquipment'})

module.exports = {
  User,
  Recipe,
  Ingredient,
  Equipment,
  Tag
}
