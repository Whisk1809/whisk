const User = require('./user')

const Recipe = require('./recipe')
const Ingredient = require('./ingredient')
const Category = require('./category')
const Preference = require('./preference')
const Requirement = require('./requirement')

//Preference relationships
User.hasMany(Preference)
Preference.belongsTo(User, {foreignKey: {allowNull: false}})
Preference.belongsTo(Recipe)
Preference.belongsTo(Category)
Preference.belongsTo(Ingredient)

//Requirement relationships
User.hasMany(Requirement)
Requirement.belongsTo(User, {foreignKey: {allowNull: false}})
Requirement.belongsTo(Recipe)
Requirement.belongsTo(Category)
Requirement.belongsTo(Ingredient)

//User to Favorite Recipe relationship
User.belongsToMany(Recipe, {through: 'FavoriteRecipes'})
Recipe.belongsToMany(User, {through: 'FavoriteRecipes'})

// //Category to Recipe relationship
Recipe.belongsToMany(Category, {through: 'RecipeCategories'})
Category.belongsToMany(Recipe, {through: 'RecipeCategories'})

// //Ingredient to Recipe relationship
Recipe.belongsToMany(Ingredient, {through: 'RecipeIngredients'})
Ingredient.belongsToMany(Recipe, {through: 'RecipeIngredients'})

module.exports = {
  User,
  Recipe,
  Ingredient,
  Equipment,
  Category,
  Preference,
  Requirement
}
