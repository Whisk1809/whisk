const {expect} = require('chai')
const db = require('../index')
const Recipe = db.model('recipe')

describe('Recipe model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })
  it('has fields title, description, prepTime, imageUrl, directions', () => {
    const recipe = Recipe.build({
      title: 'Grilled Cheese',
      description: 'A really mediocre sandwich',
      prepTime: '10 minutes',
      directions:
        '1. melt butter in heated pan 2. assemble sandwich 3. Grill it!'
    })
    expect(recipe.title).to.equal('Grilled Cheese')
    expect(recipe.description).to.equal('A really mediocre sandwich')
    expect(recipe.prepTime).to.equal('10 minutes')
    expect(recipe.directions).to.equal(
      '1. melt butter in heated pan 2. assemble sandwich 3. Grill it!'
    )
    expect(recipe.imageUrl).to.equal('default-recipe.jpg')
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
