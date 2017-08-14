#!/usr/bin/env node
var argv = require('yargs').argv
var lib = require('../lib/index.js')

if (!argv._ || !argv._[0]) {
  console.log('No URL provided')
} else {
  lib.fetchOffers(argv._, argv.output)
}
