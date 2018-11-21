//establish db connection
const neo4j = require('neo4j-driver').v1
const _ = require('lodash')
// if (process.env.NODE_ENV === 'development')
require('../../secrets')

const driver = neo4j.driver(
  process.env.GRAPHENEDB_BOLT_URL,
  neo4j.auth.basic(
    process.env.GRAPHENEDB_BOLT_USER,
    process.env.GRAPHENEDB_BOLT_PASSWORD
  )
)

async function runQuery(cypher, params = {}) {
  const session = driver.session()
  try {
    const results = session.run(cypher, params)
    session.close()
    return results
  } catch (error) {
    session.close()
    throw error
  }
}

const deleteGraph = async () => {
  await runQuery(`match (n) detach delete n`)
}
const createConstraints = async () => {
  await runQuery(`CREATE CONSTRAINT ON(u: User) ASSERT u.pk IS UNIQUE`)
  await runQuery(`CREATE CONSTRAINT ON(r: Recipe) ASSERT r.pk IS UNIQUE`)
}

//verify that user and entity exist in graph db, create / update relationship between them

const likeRecipe = async (userId, recipeId) => {
  try {
    await runQuery(
      `MERGE (u:User {pk:{userPk} })
       MERGE (r:Recipe {pk:{recipePk} })
       MERGE (u)-[l:likes]->(r)`,
      {
        userPk: userId.toString(),
        recipePk: recipeId.toString()
      }
    )
  } catch (err) {
    console.error(err)
  }
}
const dislikeRecipe = async (userId, recipeId) => {
  await runQuery(
    `MERGE (u:User {pk:{userPk} })
     MERGE (r:Recipe {pk:{recipePk} })
     MERGE (u)-[l:dislikes]->(r)`,
    {userPk: userId.toString(), recipePk: recipeId.toString()}
  )
}
const likeCategory = async (userId, categoryId) => {
  await runQuery(
    `MERGE (u:User {pk:{userPk} })
     MERGE (c:Category {pk:{categoryPk} })
     MERGE (u)-[l:likes]->(c)`,
    {userPk: userId.toString(), categoryPk: categoryId.toString()}
  )
}

const dislikeCategory = async (userId, categoryId) => {
  await runQuery(
    `MERGE (u:User {pk:{userPk} })
     MERGE (c:Category {pk:{categoryPk} })
     MERGE (u)-[l:dislikes]->(c)`,
    {userPk: userId.toString(), categoryPk: categoryId.toString()}
  )
}
const likeIngredient = async (userId, ingredientId) => {
  await runQuery(
    `MERGE (u:User {pk:{userPk} })
     MERGE (i:Ingredient {pk:{ingredientPk} })
     MERGE (u)-[l:likes]->(i)`,
    {userPk: userId.toString(), ingredientPk: ingredientId.toString()}
  )
}

const dislikeIngredient = async (userId, ingredientId) => {
  await runQuery(
    `MERGE (u:User {pk:{userPk} })
     MERGE (i:Ingredient {pk:{ingredientPk} })
     MERGE (u)-[l:dislikes]->(i)`,
    {userPk: userId.toString(), ingredientPk: ingredientId.toString()}
  )
}

const removeIngredientRelation = async (userId, ingredientId) => {
  await runQuery(
    `MATCH (u:User {pk:{userPk} })-[l]->(i:Ingredient {pk:{ingredientPk} })
     DELETE r`,
    {userPk: userId.toString(), ingredientPk: ingredientId.toString()}
  )
}
const removeRecipeRelation = async (userId, recipeId) => {
  await runQuery(
    `MATCH (u:User {pk:{userPk} })-[l]->(r:Recipe {pk:{recipePk} })
     DELETE l`,
    {userPk: userId.toString(), recipePk: recipeId.toString()}
  )
}
const removeCategoryRelation = async (userId, categoryId) => {
  await runQuery(
    `MATCH (u:User {pk:{userPk} })-[l]->(c:Category {pk:{categoryPk} })
     DELETE l`,
    {userPk: userId.toString(), categoryPk: categoryId.toString()}
  )
}

//given a node, returns the pk (as a string)
const pk = node => {
  return node._fields[0].properties.pk
}

// computeLikeIntersection (L1 intersect L2)

const computeLikeIntersection = async (uId1, uId2) => {
  const intersect = await runQuery(
    `MATCH (u1:User {pk:{uId1}})-[:likes]->(n)<-[:likes]-(u2:User {pk:{uId2}})
    RETURN n
    `,
    {uId1: uId1.toString(), uId2: uId2.toString()}
  )
  return intersect.records.length
}

// computeInteractionUnion (L1 union L2 union D1 union D2)
// is it pretty? no. does it work? yes.
const computeInteractionUnion = async (uId1, uId2) => {
  const [l1, l2, d1, d2] = await Promise.all([
    runQuery(
      `MATCH (u1:User {pk:{uId1}})-[:likes]->(n)
    RETURN n`,
      {uId1: uId1.toString()}
    ),
    runQuery(
      `MATCH (u1:User {pk:{uId2}})-[:likes]->(n)
    RETURN n`,
      {uId2: uId2.toString()}
    ),
    runQuery(
      `MATCH (u1:User {pk:{uId1}})-[:dislikes]->(n)
    RETURN n`,
      {uId1: uId1.toString()}
    ),
    runQuery(
      `MATCH (u1:User {pk:{uId2}})-[:dislikes]->(n)
    RETURN n`,
      {uId2: uId2.toString()}
    )
  ])
  const l1Pks = l1.records.map(record => pk(record))
  const l2Pks = l2.records.map(record => pk(record))
  const d1Pks = d1.records.map(record => pk(record))
  const d2Pks = d2.records.map(record => pk(record))
  const union = _.union(l1Pks, l2Pks, d1Pks, d2Pks)

  return union.length
}

// computeDislikeIntersection (D1 intersect D2)

const computeDislikeIntersection = async (uId1, uId2) => {
  const intersect = await runQuery(
    `MATCH (u1:User {pk:{uId1}})-[:dislikes]->(n)<-[:dislikes]-(u2:User {pk:{uId2}})
      RETURN n
      `,
    {uId1: uId1.toString(), uId2: uId2.toString()}
  )
  return intersect.records.length
}

// computeMismatchIntersection (L1 intersect D2 + D1 intersect L2)
const computeMismatchIntersection = async (uId1, uId2) => {
  const intersect1 = await runQuery(
    `MATCH (u1:User {pk:{uId1}})-[:likes]->(n)<-[:dislikes]-(u2:User {pk:{uId2}})
        RETURN n
        `,
    {uId1: uId1.toString(), uId2: uId2.toString()}
  )
  const intersect2 = await runQuery(
    `MATCH (u1:User {pk:{uId1}})-[:dislikes]->(n)<-[:likes]-(u2:User {pk:{uId2}})
        RETURN n
        `,
    {uId1: uId1.toString(), uId2: uId2.toString()}
  )
  return intersect1.records.length + intersect2.records.length
}

//given two user IDs, computes and returns the modified Jaccard Index (a similarity index between -1 and 1)

const computeJaccard = async (uId1, uId2) => {
  const [sameLikes, sameDislikes, mismatches, union] = await Promise.all([
    computeLikeIntersection(uId1, uId2),
    computeDislikeIntersection(uId1, uId2),
    computeMismatchIntersection(uId1, uId2),
    computeInteractionUnion(uId1, uId2)
  ])
  const jaccard = (sameLikes + sameDislikes - mismatches) / union
  return jaccard
}

// given a userId and a recipeId, computes and returns a recommendation index between -1 and 1
// P(U,R) = (ZL - ZD) / (sum of all users who interacted with R)

const computeRecommendationIndex = async (uId, rId) => {
  const [usersWhoLikeRecipe, usersWhoDislikeRecipe] = await Promise.all([
    runQuery(
      `MATCH (u:User)-[:likes]->(r:Recipe {pk:{rId}})
    WHERE u.pk <> {uId}
    RETURN u`,
      {uId: uId.toString(), rId: rId.toString()}
    ),
    runQuery(
      `MATCH (u:User)-[:dislikes]->(r:Recipe {pk:{rId}})
    WHERE u.pk <> {uId}
    RETURN u`,
      {uId: uId.toString(), rId: rId.toString()}
    )
  ])

  const Z1 = await Promise.all(
    usersWhoLikeRecipe.records.map(record => computeJaccard(uId, pk(record)))
  ).then(arr =>
    arr.reduce((sum, val) => {
      sum += val
      return sum
    }, 0)
  )
  const Z2 = await Promise.all(
    usersWhoDislikeRecipe.records.map(record => computeJaccard(uId, pk(record)))
  ).then(arr =>
    arr.reduce((sum, val) => {
      sum += val
      return sum
    }, 0)
  )
  const recommendationIndex =
    (Z1 + Z2) /
    (usersWhoLikeRecipe.records.length + usersWhoDislikeRecipe.records.length)

  return recommendationIndex
}

//return an array of recommended recipeIds (as nums NOT strings)
const recommend = async uId => {
  const [recipesNotYetLiked, recipesNotYetDisliked] = await Promise.all([
    runQuery(
      `MATCH (r:Recipe),(u:User {pk:{uId}}) WHERE NOT (r)<-[:likes]-(u)
      RETURN r`,
      {uId: uId.toString()}
    ),
    runQuery(
      `MATCH (r:Recipe),(u:User {pk:{uId}}) WHERE NOT (r)<-[:dislikes]-(u)
      RETURN r`,
      {uId: uId.toString()}
    )
  ])
  const intersection = _.intersection(
    recipesNotYetLiked.records.map(record => pk(record)),
    recipesNotYetDisliked.records.map(record => pk(record))
  )
  console.log(
    'notYetLiked: ',
    recipesNotYetLiked.records.map(record => pk(record))
  )
  console.log(
    'notYetDisLiked: ',
    recipesNotYetDisliked.records.map(record => pk(record))
  )

  // takes the recipes that a user has not interacted with and does the following:
  // computes a recommendation index for the recipes
  // maps the recipes to a new array containing Ids and recommendation indices
  // sorts the recipes by recommendation index

  const recArr = await Promise.all(
    intersection.map(rId => {
      const index = computeRecommendationIndex(uId, rId)
      return index
    })
  ).then(res =>
    res
      .map((recIndex, i) => ({recipeId: Number(intersection[i]), recIndex}))
      .sort((a, b) => b.recIndex - a.recIndex)
  )
  console.log('recommendations: ', recArr)

  return recArr
}
// ;(async () => {
//   // await deleteGraph()
//   // await createConstraints()
//   await recommend(4)
// })()

module.exports = {
  likeCategory,
  likeIngredient,
  likeRecipe,
  graphDb: driver,
  dislikeCategory,
  dislikeIngredient,
  dislikeRecipe,
  removeCategoryRelation,
  removeRecipeRelation,
  removeIngredientRelation,
  deleteGraph,
  createConstraints,
  computeRecommendationIndex,
  recommend
}
