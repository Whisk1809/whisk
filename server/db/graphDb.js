//establish db connection
const neo4j = require('neo4j-driver').v1

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
    `merge (u:User {pk:{userPk} })
    merge (r:Recipe {pk:{recipePk} })
    merge (u)-[l:likes]->(r)`,
    {
      userPk: userId.toString(),
      recipePk: recipeId.toString()
    }
  )
}
const dislikeRecipe = async (userId, recipeId) => {
  await runQuery(
    ` merge (u:User { pk: {userPk}})-[:dislikes]->(r:Recipe {pk: {recipePk}})`,
    {userPk: userId.toString(), recipePk: recipeId.toString()}
  )
}
const likeCategory = async (userId, categoryId) => {
  await runQuery(
    ` merge (u:User { pk: {userPk}})-[:likes]->(r:Category {pk: {categoryPk}})`,
    {userPk: userId.toString(), categoryPk: categoryId.toString()}
  )
}
const dislikeCategory = async (userId, categoryId) => {
  await runQuery(
    ` merge (u:User { pk: {userPk}})-[:dislikes]->(r:Category {pk: {categoryPk}})`,
    {userPk: userId.toString(), categoryPk: categoryId.toString()}
  )
}
;(async () => {
  await deleteGraph()
  await createConstraints()
  await likeRecipe(1, 1)
  await likeRecipe(1, 2)
  await likeRecipe(1, 3)
  await likeRecipe(2, 1)
  await likeRecipe(2, 3)
  await likeRecipe(3, 1)
  await likeRecipe(3, 3)
})()

// const recommend = userId => {
//   //return an array of recommended recipes
// }

// module.exports = {
//   like,
//   dislike,
//   recommend
// }
