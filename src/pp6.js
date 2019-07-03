#!/usr/bin/env node
// ex: node pp6 --path=../doc
const argv = require('yargs').argv
const pub = require('./md6/pub')

let op = argv._[0]
// console.log('op=%s', op, 'argv._=', argv._)

switch (op) {
  case 'pub': pub.convertAll(argv.path); break
  default: console.log('Error: op=%s not found!', op)
}

