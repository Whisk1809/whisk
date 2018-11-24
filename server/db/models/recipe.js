const Sequelize = require('sequelize')
const db = require('../db')
const Op = Sequelize.Op

const Recipe = db.define('recipe', {
  title: {
    type: Sequelize.STRING,
    validate: {notEmpty: true},
    allowNull: false
  },
  source: {
    type: Sequelize.STRING,
    allowNull: true
  },
  sourceId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true
  },
  prepTime: {
    type: Sequelize.STRING
  },
  prepTimeSeconds: {type: Sequelize.INTEGER},
  numberOfServings: {type: Sequelize.INTEGER},
  sourceRecipeUrl: {type: Sequelize.STRING},
  ingredientList: {type: Sequelize.ARRAY(Sequelize.STRING)},
  imageUrl: {
    type: Sequelize.STRING,
    defaultValue: 'default-recipe.jpg'
  }
})

//returns the 15 recipes sorted based purely on absolute like count within the past month
Recipe.getTrending = async () => {
  const t = new Date()
  t.setDate(t.getMonth() - 1)
  const recipes = await db.query(
    `
  SELECT  *
  FROM recipes AS r
  INNER JOIN
  (SELECT p."recipeId", COUNT(*) AS likeCount
  FROM preferences AS p
  WHERE (p."recipeId" IS NOT NULL) AND (p.prefers = TRUE) AND (p."createdAt" > :monthAgo)
  GROUP BY p."recipeId") AS x
  ON r.id = x."recipeId"
  ORDER BY likeCount DESC
  LIMIT 15`,
    {type: Sequelize.QueryTypes.SELECT, replacements: {monthAgo: t}}
  )
  return recipes
}

//returns the 15 recipes sorted based purely on all time absolute like count
Recipe.getPopular = async () => {
  const recipes = await db.query(
    `
  SELECT  *
  FROM recipes AS r
  INNER JOIN
  (SELECT p."recipeId", COUNT(*) AS likeCount
  FROM preferences AS p
  WHERE (p."recipeId" IS NOT NULL) AND (p.prefers = TRUE)
  GROUP BY p."recipeId") AS x
  ON r.id = x."recipeId"
  ORDER BY likeCount DESC
  LIMIT 15`,
    {type: Sequelize.QueryTypes.SELECT}
  )
  return recipes
}
//returns the 15 recipes sorted based on create date - specific to the user Id to ensure this is something they have not previously interacted with
Recipe.getNew = async uId => {
  const recipes = await db.query(
    `
  SELECT  *
  FROM recipes AS r
  LEFT JOIN preferences AS p
  ON r.id = p."recipeId" AND p."userId" <>:uId
  LEFT JOIN "FavoriteRecipes" as f
  ON r.id = f."recipeId" AND f."userId" <>:uId
  ORDER BY r."createdAt" DESC
  LIMIT 15`,
    {type: Sequelize.QueryTypes.SELECT, replacements: {uId}}
  )
  return recipes
}
Recipe.findIds = async arr => {
  return Recipe.findAll({where: {id: {[Op.in]: arr}}})
}

module.exports = Recipe
