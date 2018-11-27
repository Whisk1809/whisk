const {expect} = require('chai')
const db = require('../index')
const Recipe = db.model('recipe')

describe('Recipe model', () => {
  beforeEach(() => {
    return db.sync({force: true})
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
  it('has a class method which returns popular recipes', () => {
    expect()
  })
  it('has a class method which returns trending recipes', () => {
    expect()
  })
  it('has a class method which returns new recipes based on the user ID')
  describe('popular recipes class method', () => {
    it('returns exactly 15 recipes', () => {
      expect()
    })
    it('returns the most popular recipes based on all time absolute like count', () => {
      expect()
    })
  })
  describe('new recipes class method', () => {
    it('returns exactly 15 recipes', () => {
      expect()
    })
    it('gives different content based on the user', () => {
      expect()
    })
    it('returns recipes that the user has not interacted with (via favorite recipes or via preferences)', () => {
      expect()
    })
  })
  describe('trending recipes class method', () => {
    it('returns exactly 15 recipes', () => {
      expect()
    })
  })
  describe('recommended recipes class method', () => {
    it('returns exactly 15 recipes', () => {
      expect()
    })
    it('gives different content based on the user', () => {
      expect()
    })
    it('returns recipes that the user has not interacted with (via favorite recipes or via preferences)', () => {
      expect()
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
  // end describe('instanceMethods')
}) // end describe('User model')
