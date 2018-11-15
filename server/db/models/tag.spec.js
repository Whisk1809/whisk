/* global describe beforeEach it */

const {expect} = require('chai')
const db = require('../index')
const Tag = db.model('tag')

describe('Tag model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })
  afterEach(() => {
    return db.sync({force: true})
  })

  describe('tag name', () => {
    let italian
    beforeEach(async () => {
      italian = await Tag.create({
        name: 'Italian'
      })
    })

    it('matches the name we give it', () => {
      expect(italian.name).to.equal('Italian')
    })
  })
})
