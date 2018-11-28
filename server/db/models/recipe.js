const Sequelize = require('sequelize')
const {recommender} = require('../graphDb')

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
    type: Sequelize.STRING
    // allowNull: false
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
  t.setMonth(t.getMonth() - 1)
  const recipes = await db.query(
    `
  SELECT DISTINCT r.*,x.likeCount
  FROM recipes AS r
  INNER JOIN
  (SELECT p."recipeId", COUNT(*) AS likeCount
  FROM preferences AS p
  WHERE (p."recipeId" IS NOT NULL) AND (p.prefers = TRUE) AND (p."createdAt" > :monthAgo)
  GROUP BY p."recipeId") AS x
  ON r.id = x."recipeId"
  ORDER BY x.likeCount DESC
  LIMIT 15`,
    {
      type: Sequelize.QueryTypes.SELECT,
      replacements: {monthAgo: t.toLocaleDateString()}
    }
  )

  return recipes
}

//returns the 15 recipes sorted based purely on all time absolute like count
Recipe.getPopular = async () => {
  const recipes = await db.query(
    `
  SELECT DISTINCT r.*,x.likeCount
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
Recipe.search = plaintext => {
  db.query(
    `SELECT *
  FROM recipes
  WHERE "RecipeTitle" @@plainto_tsquery(:plaintext)`,
    {type: Sequelize.QueryTypes.SELECT, replacements: {plaintext}}
  )
}

//returns the 15 recipes sorted based on create date - specific to the user Id to ensure this is something they have not previously interacted with
Recipe.getNew = async uId => {
  const recipes = await db.query(
    `
  SELECT DISTINCT r.*
  FROM recipes AS r
  LEFT JOIN preferences AS p
  ON r.id = p."recipeId" AND p."userId" = :uId
  LEFT JOIN "FavoriteRecipes" as f
  ON r.id = f."recipeId" AND f."userId" = :uId
  WHERE p.id IS NULL AND f."recipeId" IS NULL
  ORDER BY r."createdAt" DESC
  LIMIT 15`,
    {type: Sequelize.QueryTypes.SELECT, replacements: {uId}}
  )
  return recipes
}
Recipe.findIds = async arr => {
  return Recipe.findAll({where: {id: {[Op.in]: arr}}})
}

Recipe.recommend = async uId => {
  const ids = await recommender(uId)
  console.log('recipes recommended by recommendation engine: ', ids)
  const padding = 15 - ids.length >= 0 ? 15 - ids.length : 0
  const recipes = await db.query(
    `
WITH
recommendations AS(SELECT DISTINCT r.*
  FROM recipes AS r
    LEFT JOIN preferences AS p
    ON r.id = p."recipeId" AND p."userId" = :uId
    LEFT JOIN "FavoriteRecipes" as f
    ON r.id = f."recipeId" AND f."userId" = :uId
  WHERE r.id IN (:ids) AND p.id IS NULL AND f."recipeId" IS NULL
  LIMIT 15),
padding AS (
SELECT DISTINCT r.*
  FROM recipes AS r
    INNER JOIN
    (SELECT p."recipeId", COUNT(*) AS likeCount
    FROM preferences AS p
    WHERE (p."recipeId" IS NOT NULL) AND (p.prefers = TRUE)
    GROUP BY p."recipeId"
    ORDER BY likeCount DESC
    ) AS x
    ON r.id = x."recipeId"
    LEFT JOIN preferences AS p
    ON r.id = p."recipeId" AND p."userId" = :uId
    LEFT JOIN "FavoriteRecipes" as f
    ON r.id = f."recipeId" AND f."userId" = :uId
  WHERE r.id NOT IN (SELECT id from recommendations ) and p.id IS NULL AND f."recipeId" IS NULL
  LIMIT :padding
  )

SELECT * from recommendations
UNION ALL
SELECT * FROM padding
  `,
    {type: Sequelize.QueryTypes.SELECT, replacements: {ids, uId, padding}}
  )
  return recipes
}

Recipe.addFullTextIndex = function() {
  if (db.options.dialect !== 'postgres') {
    console.log('Not creating search index, must be using POSTGRES to do this')
    return
  }

  var searchFields = ['title']
  var Recipe = this

  var vectorName = 'RecipeTitle'
  db
    .query(
      'ALTER TABLE "' + 'recipes' + '" ADD COLUMN "' + vectorName + '" TSVECTOR'
    )
    .then(function() {
      return db
        .query(
          'UPDATE "' +
            'recipes' +
            '" SET "' +
            vectorName +
            "\" = to_tsvector('english', " +
            searchFields.join(" || ' ' || ") +
            ')'
        )
        .error(console.log)
    })
    .then(function() {
      return db
        .query(
          'CREATE INDEX recipe_search_idx ON "' +
            'recipes' +
            '" USING gin("' +
            vectorName +
            '");'
        )
        .error(console.log)
    })
    .then(function() {
      return db
        .query(
          'CREATE TRIGGER recipe_vector_update BEFORE INSERT OR UPDATE ON "' +
            'recipes' +
            '" FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger("' +
            vectorName +
            "\", 'pg_catalog.english', " +
            searchFields.join(', ') +
            ')'
        )
        .error(console.log)
    })
    .error(console.log)
}

module.exports = Recipe
