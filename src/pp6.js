#!/usr/bin/env node
const argv = require('yargs').argv
const pub = require('./app/pub')
const server = require('./app/server')

let op = argv._[0]

switch (op) {
  case 'pub': pub.convertAll(argv.path); break // node pp6 pub --path=../../course
  case 'server': server.run({
      port: argv.port || 3000, 
      root: argv.root || './'
    }); break // node pp6 server --port=80
  default: console.log('Error: op=%s not found!', op)
}

