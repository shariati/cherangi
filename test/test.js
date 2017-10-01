'use strict'
/* eslint-env mocha */
const assert = require('assert')
const cherangi = require('../')

describe('cherangi', () => {
  it('should return Hickory Cliff', done => {
    const expected = cherangi('7C6E6D').name
    assert.equal('Hickory Cliff', expected)
    done()
  })
  it('should return Hickory Cliff', done => {
    const expected = cherangi('#7C6E6D').name
    assert.equal('Hickory Cliff', expected)
    done()
  })
  it('should return Meadow Violet', done => {
    const expected = cherangi('#72497D').name
    assert.equal('Meadow Violet', expected)
    done()
  })
  it('should return Black on invalid entry', done => {
    const expected = cherangi('bvcds').name
    assert.equal('Black', expected)
    done()
  })
})
