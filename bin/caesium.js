#!/usr/bin/env node

program = require('commander')

path = require('path')

pkg = require(path.join(__dirname, '..', 'package.json'));

Caesium = require(path.join(__dirname, '..'))

program
  .version(pkg.name + '@' + pkg.version)
  .option('local', 'run the application localy')
  .option('build', 'build the application')
  .option('new <path>', 'create a new application in the given path')
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

if(program.new){
  console.log('Creating new Caesium application')

  newApplication = require('../lib/tasks/new')
  newApplication(program.new)
}
