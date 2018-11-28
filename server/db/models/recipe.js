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
Recipe.search = async plaintext => {
  let recipes, maxTime
  const text = []

  const arr = plaintext.split(' ')
  console.log('arr: ', arr)
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][0] === '<') maxTime = Number(arr[i].slice(1))
    else text.push(arr[i])
  }
  console.log('maxTime: ', maxTime)
  if (!maxTime && text.length === 1) {
    recipes = await db.query(
      `SELECT *
  FROM recipes
  WHERE _search @@plainto_tsquery(:plaintext)
  UNION ALL
  SELECT r.* FROM recipes r
  JOIN "RecipeIngredients" ri ON r.id = ri."recipeId"
  JOIN ingredients i on ri."ingredientId" = i.id
  WHERE i._search @@plainto_tsquery(:plaintext)
  `,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {plaintext}
      }
    )
  } else if (maxTime && text.length === 0) {
    //query with just time
    recipes = await db.query(
      `SELECT *
  FROM recipes
  WHERE "prepTimeSeconds" < :maxTime
  `,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {maxTime: maxTime * 60}
      }
    )
  } else if (!maxTime) {
    //query with multiple words
    const str = text.map(word => `plainto_tsquery('${word}')`).join(' || ')
    const q = `i._search @@(${str}) AND r._search @@(${str})`
    recipes = await db.query(
      `
  SELECT r.* FROM recipes r
  JOIN "RecipeIngredients" ri ON r.id = ri."recipeId"
  JOIN ingredients i on ri."ingredientId" = i.id
  WHERE
    ` +
        q +
        `
  UNION ALL
  SELECT *
  FROM recipes
  WHERE _search @@plainto_tsquery(:plaintext)
  UNION ALL
  SELECT r.* FROM recipes r
  JOIN "RecipeIngredients" ri ON r.id = ri."recipeId"
  JOIN ingredients i on ri."ingredientId" = i.id
  WHERE i._search @@plainto_tsquery(:plaintext)`,
      {type: Sequelize.QueryTypes.SELECT, replacements: {plaintext}}
    )
  } else {
    //query with multiple words and time
    const str = text.map(word => `plainto_tsquery('${word}')`).join(' || ')
    const q = `i._search @@(${str}) AND r._search @@(${str})`
    recipes = await db.query(
      `
  SELECT r.* FROM recipes r
  JOIN "RecipeIngredients" ri ON r.id = ri."recipeId"
  JOIN ingredients i on ri."ingredientId" = i.id
  WHERE r."prepTimeSeconds" < :maxTime AND
    ` +
        q +
        `
  UNION ALL
  SELECT *
  FROM recipes
  WHERE _search @@plainto_tsquery(:plaintext) AND  "prepTimeSeconds" < :maxTime
  UNION ALL
  SELECT r.* FROM recipes r
  JOIN "RecipeIngredients" ri ON r.id = ri."recipeId"
  JOIN ingredients i on ri."ingredientId" = i.id
  WHERE i._search @@plainto_tsquery(:plaintext) AND  r."prepTimeSeconds" < :maxTime
`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {plaintext: text.join(' '), maxTime: maxTime * 60}
      }
    )
  }

  return recipes
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

  const vectorName = '_search'
  db
    .query(
      `
      ALTER TABLE recipes
      ADD COLUMN ${vectorName} TSVECTOR;
      `
    )
    .then(function() {
      return db
        .query(
          ` ALTER TABLE ingredients
      ADD COLUMN ${vectorName} TSVECTOR;
          `
        )
        .catch(err => console.error(err))
    })
    .then(function() {
      return db
        .query(
          `
        UPDATE recipes SET ${vectorName} = to_tsvector('english',title);
          `
        )
        .catch(err => console.error(err))
    })
    .then(function() {
      return db
        .query(
          `
        UPDATE ingredients SET ${vectorName} = to_tsvector('english',name);
          `
        )
        .catch(err => console.error(err))
    })
    .then(function() {
      return db
        .query(
          `
        CREATE INDEX recipe_search_idx ON recipes USING gin(${vectorName})
          `
        )
        .catch(err => console.error(err))
    })
    .then(function() {
      return db
        .query(
          `
        CREATE INDEX ingredient_search_idx ON ingredients USING gin(${vectorName})
          `
        )
        .catch(err => console.error(err))
    })
    .then(function() {
      return db
        .query(
          `CREATE TRIGGER recipe_vector_update BEFORE INSERT OR UPDATE ON recipes
          FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(${vectorName}, 'pg_catalog.english',title)`
        )
        .catch(err => console.error(err))
    })
    .then(function() {
      return db
        .query(
          ` CREATE TRIGGER ingredient_vector_update BEFORE INSERT OR UPDATE ON ingredients
          FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger(${vectorName}, 'pg_catalog.english',name)`
        )
        .catch(err => console.error(err))
    })
    .catch(err => console.error(err))
}

module.exports = Recipe
