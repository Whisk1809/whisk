'use strict'
/* global describe beforeEach it */

const seed = require('./seed')

describe('seed script', () => {
  it('completes successfully', function(done) {
    this.timeout(0)
    seed(done)
  })
})
