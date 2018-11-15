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

//verify that user and entity exist in graph db, create / update relationship between them
const like = async (userId, entity) => {
  await runQuery(
    ` merge (u:User { pk: {userPk}})-[:likes]->(r:Recipe {pk: {recipePk}})`,
    {userPk: userId.toString(), recipePk: entity.id.toString()}
  )
}

like(1, {id: 1, type: 'Recipe'})

const dislike = (userId, entity) => {
  //verify that user and entity exist in graph db, create / update relationship between them
}
const recommend = userId => {
  //return an array of recommended recipes
}

module.exports = {
  like,
  dislike,
  recommend
}
