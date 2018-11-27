const {expect} = require('chai')
const db = require('../index')
const Recipe = db.model('recipe')
const Preference = db.model('preference')
const User = db.model('user')
const {createConstraints, deleteGraph} = require('../graphDb')

describe('Recipe model', () => {
  before('sync the db', async () => {
    await deleteGraph()
    await createConstraints()
    await db.sync({force: true})
  })
  it('has fields title, description, prepTime, imageUrl', () => {
    const recipe = Recipe.build({
      title: 'Grilled Cheese',
      description: 'A really mediocre sandwich',
      prepTime: '10 minutes'
    })
    expect(recipe.title).to.equal('Grilled Cheese')
    expect(recipe.description).to.equal('A really mediocre sandwich')
    expect(recipe.prepTime).to.equal('10 minutes')
    expect(recipe.imageUrl).to.equal('default-recipe.jpg')
  })
  describe('class methods', () => {
    beforeEach(async () => {
      await db.sync({force: true})
      await deleteGraph()
      await createConstraints()
      const today = new Date()
      const longTimeAgo = new Date('December 17, 1995 03:24:00')
      const recipes = await Promise.all([
        Recipe.create({title: '1'}),
        Recipe.create({title: '2'}),
        Recipe.create({title: '3'}),
        Recipe.create({title: '4'}),
        Recipe.create({title: '5'}),
        Recipe.create({title: '6'}),
        Recipe.create({title: '7'}),
        Recipe.create({title: '8'}),
        Recipe.create({title: '9'}),
        Recipe.create({title: '10'}),
        Recipe.create({title: '11'}),
        Recipe.create({title: '12'}),
        Recipe.create({title: '13'}),
        Recipe.create({title: '14'}),
        Recipe.create({title: '15'}),
        Recipe.create({title: '16'}),
        Recipe.create({title: '17'}),
        Recipe.create({title: '18'}),
        Recipe.create({title: '19'}),
        Recipe.create({title: '20'}),
        Recipe.create({title: '21'}),
        Recipe.create({title: '22'})
      ])
      const users = await Promise.all([
        User.create({email: 'user1@email.com'}),
        User.create({email: 'user2@email.com'}),
        User.create({email: 'user3@email.com'}),
        User.create({email: 'user4@email.com'}),
        User.create({email: 'user5@email.com'}),
        User.create({email: 'user6@email.com'})
      ])
      //  we must do these sequentially to avoid lock conflicts with the graph
      await Preference.create({
        userId: users[0].id,
        recipeId: recipes[0].id,
        prefers: true,
        createdAt: today
      })
      await Preference.create({
        userId: users[1].id,
        recipeId: recipes[0].id,
        prefers: true,
        createdAt: today
      })
      await Preference.create({
        userId: users[2].id,
        recipeId: recipes[0].id,
        prefers: true,
        createdAt: today
      })
      await Preference.create({
        userId: users[0].id,
        recipeId: recipes[1].id,
        prefers: true,
        createdAt: longTimeAgo
      })
      await Preference.create({
        userId: users[1].id,
        recipeId: recipes[1].id,
        prefers: true,
        createdAt: longTimeAgo
      })
      await Preference.create({
        userId: users[2].id,
        recipeId: recipes[1].id,
        prefers: true,
        createdAt: longTimeAgo
      })
      await Preference.create({
        userId: users[3].id,
        recipeId: recipes[1].id,
        prefers: true,
        createdAt: longTimeAgo
      })
      await Preference.create({
        userId: users[2].id,
        recipeId: recipes[2].id,
        prefers: true,
        createdAt: longTimeAgo
      })
      await Preference.create({
        userId: users[2].id,
        recipeId: recipes[3].id,
        prefers: true,
        createdAt: longTimeAgo
      })
      await Preference.create({
        userId: users[2].id,
        recipeId: recipes[4].id,
        prefers: true,
        createdAt: today
      })
      await users[0].setRecipes([recipes[4].id, recipes[5].id])
    })

    describe('get popular', () => {
      it('returns at most 15 recipes, returns no less than how many recipes have likes in the db', async () => {
        const r = await Recipe.getPopular()
        expect(r.length).to.be.equal(5)
      })
      it('returns a sorted array by popularity of the most popular recipes based on all time absolute like count', async () => {
        const r = await Recipe.getPopular()
        expect(r[0].title).to.equal('2')
      })
    })
    describe('trending recipes class method', () => {
      it('returns at most 15 recipes, returns no less than how many recipes have likes in the db in the last month', async () => {
        const r = await Recipe.getTrending()
        expect(r.length).to.equal(2)
      })
      it('returns a sorted array of trending recipes based on absolute like count within the past month', async () => {
        const r = await Recipe.getTrending()
        expect(r[0].title).to.equal('1')
      })
    })
    describe('new recipes class method', () => {
      it('returns exactly 15 recipes', async () => {
        const user1 = await User.findOne({where: {email: 'user1@email.com'}})
        const r = await Recipe.getNew(user1.id)
        expect(r.length).to.equal(15)
      })

      it('returns recipes that the user has not interacted with (via favorite recipes or via preferences)', () => {
        expect()
      })
    })
    describe('recommended recipes class method', () => {
      it('at most 15 recipes regardless of user interaction history', async () => {
        const user1 = await User.findOne({where: {email: 'user1@email.com'}})
        const user5 = await User.findOne({where: {email: 'user5@email.com'}})
        const r0 = await Recipe.recommend(user1.id)
        const r5 = await Recipe.recommend(user5.id)
        expect(r0.length).to.equal(2)
        expect(r5.length).to.equal(5)
      })
      it('gives different content based on the user', async () => {
        const user1 = await User.findOne({where: {email: 'user1@email.com'}})
        const user5 = await User.findOne({where: {email: 'user5@email.com'}})
        const r0 = await Recipe.recommend(user1.id)
        const r5 = await Recipe.recommend(user5.id)
        expect(r0).to.not.deep.equal(r5)
      })
      it('returns recipes that are liked by users most similar to the input user', async () => {
        const user1 = await User.findOne({where: {email: 'user1@email.com'}})
        const r = await Recipe.recommend(user1.id)
        const ids = r.map(r => r.title)
        expect(ids.includes('3')).to.be.equal(true)
      })
      it('returns recipes that the user has not interacted with (via favorite recipes or via preferences)', async () => {
        const user1 = await User.findOne({where: {email: 'user1@email.com'}})
        const r0 = await Recipe.recommend(user1.id)
        const recommendedId = r0[0].id

        await Preference.create({
          userId: user1.id,
          recipeId: recommendedId,
          prefers: true
        })
        const r1 = await Recipe.recommend(user1.id)
        const ids = r1.map(r => r.id)
        expect(ids.includes(recommendedId)).to.be.equal(false)
      })
    })
  })
  it('title and directions validations', async () => {
    const recipe = Recipe.build({
      title: null,
      directions: null
    })

    let result, error
    try {
      result = await recipe.validate()
    } catch (err) {
      error = err
    }

    if (result) {
      throw Error('validation should fail when title and direction are null')
    }

    expect(error).to.be.an.instanceOf(Error)
  })
})

// describe('class methods', () => {
//   describe('popular recipes class method', async () => {})

//
// })

// end describe('instanceMethods')
// end describe('User model')
