#!/usr/bin/env node
'use strict'
const pkg = require('./package.json')
const cherangi = require('./')

require('taketalk')({
  init (input, options) {
    console.log(cherangi(input, options))
  },
  help () {
    console.log(
      [
        '',
        '  ' + pkg.description,
        '',
        '  Usage',
        '    cherangi <string>',
        '    echo <string> | cherangi',
        '',
        '  Example',
        '    cherangi "7CB9E8"',
        cherangi('7CB9E8')
      ].join('\n')
    )
  },
  version: pkg.version
})
