//establish db connection
const neo4j = require('neo4j-driver').v1
const _ = require('lodash')

const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'dev')
)

async function runQuery(cypher, params = {}) {
  try {
    const session = driver.session()
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
//TODO consider case where user switches from liking to disliking an entity (or vice versa)

const likeRecipe = async (userId, recipeId) => {
  await runQuery(
    // `MERGE (u:User { pk: {userPk}})-[:likes]->(r:Recipe {pk: {recipePk}})`,
    `MERGE (u:User {pk:{userPk} })
     MERGE (r:Recipe {pk:{recipePk} })
     MERGE (u)-[l:likes]->(r)`,
    {
      userPk: userId.toString(),
      recipePk: recipeId.toString()
    }
  )
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
//given a node, returns the pk (as a string)
const pk = node => {
  return node._fields[0].properties.pk
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

//given two user IDs, computes the modified Jaccard Index (a similarity index between -1 and 1)

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
;(async () => {
  // await deleteGraph()
  // await createConstraints()
  await computeJaccard(1, 2)
})()

// const recommend = userId => {
//   //return an array of recommended recipes
// }

module.exports = {
  likeCategory,
  likeIngredient,
  likeRecipe,
  dislikeCategory,
  dislikeIngredient,
  dislikeRecipe,
  deleteGraph,
  createConstraints
}
