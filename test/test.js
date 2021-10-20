'use strict'
/* eslint-env mocha */
const assert = require('assert')
const cherangi = require('../')

describe('Testing color codes various format', () => {
  it('An input of 7C6E6D, should return Hickory Cliff', done => {
    const expected = cherangi('7C6E6D').name
    assert.strict.equal('Hickory Cliff', expected)
    done()
  })
  it('An input of CdCDcD, should return Compact Disc Grey', done => {
    const expected = cherangi('CdCDcD').name
    assert.strict.equal('Compact Disc Grey', expected)
    done()
  })
  it('An input of ddd, should return Steam', done => {
    const expected = cherangi('ddd').name
    assert.strict.equal('Steam', expected)
    done()
  })
})
describe('Testing few set of color codes in hex value', () => {
  it('An input of #7C6E6D, should return Hickory Cliff', done => {
    const expected = cherangi('#7C6E6D').name
    assert.strict.equal('Hickory Cliff', expected)
    done()
  })
  it('An input of #72497D, should return Lilac Violet', done => {
    const expected = cherangi('#72497D').name
    assert.strict.equal('Lilac Violet', expected)
    done()
  })
  it('An input of #CDCDCD, should return Compact Disc Grey', done => {
    const expected = cherangi('#CDCDCD').name
    assert.strict.equal('Compact Disc Grey', expected)
    done()
  })
  it('An input of #72497D, should return Lilac Violet', done => {
    const expected = cherangi('#72497D').name
    assert.strict.equal('Lilac Violet', expected)
    done()
  })
})

describe('Testing invalid inputs', () => {
  it('should return Black on invalid entry', done => {
    const expected = cherangi('bvcds').name
    assert.strict.equal('Black', expected)
    done()
  })
})
