const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const Recipe = db.model('recipe')

describe('Recipe routes', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('/api/recipes/', () => {
    beforeEach(() => {
      return Recipe.create({
        title: 'Grilled Cheese',
        description: 'A really mediocre sandwich',
        prepTime: '10 minutes'
      })
    })

    it('GET /api/recipes', async () => {
      const res = await request(app)
        .get('/api/recipes')
        .expect(200)

      expect(res.body).to.be.an('array')
      expect(res.body[0].title).to.be.equal('Grilled Cheese')
    })
  }) // end describe('/api/users')
}) // end describe('User routes')
