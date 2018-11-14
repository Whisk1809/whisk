const User = require('./user')
const Recipe = require('./recipe')
const Ingredient = require('./ingredient')
const Equipment = require('./equipment')
const Tag = require('./tag')

//Tag to Recipe relationship
Recipe.hasMany(Tag, {through: 'RecipeTags'})
Tag.hasMany(Recipe, {through: 'RecipeTags'})

//Ingredient to Recipe relationship
Recipe.hasMany(Ingredient, {through: 'RecipeIngredients'})
Ingredient.hasMany(Recipe, {through: 'RecipeIngredients'})

//Equipment to Recipe relationship
Equipment.hasMany(Recipe, {through: 'RecipeEquipment'})
Recipe.hasMany(Equipment, {through: 'RecipeEquipment'})

module.exports = {
  User,
  Recipe,
  Ingredient,
  Equipment,
  Tag
}
