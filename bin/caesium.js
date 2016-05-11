#!/usr/bin/env node

program = require('commander')

path = require('path')

pkg = require(path.join(__dirname, '..', 'package.json'));

Caesium = require(path.join(__dirname, '..'))

program
  .version(pkg.name + '@' + pkg.version)
  .option('local', 'run the application localy')
  .option('build', 'build the application')
  .parse(process.argv)

if(program.local){
  console.log('Hosting Caesium application')

  caesium = new Caesium(process.cwd())

  local = require('../lib/tasks/local')
  local(caesium)
}

if(program.build){
  console.log('Building Caesium')

  caesium = new Caesium(process.cwd())

  build = require('../lib/tasks/build')
  build(caesium)
}
