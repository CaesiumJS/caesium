defaults = require('defaults')

fs = require('fs')
path = require('path')

HTMLView = require('./react/html')
SourceMap = require('./caesium/source_map')
Build = require('./caesium/build')
Client = require('./caesium/client')

Pkg = require(path.join(__dirname, '..', 'package.json'))

process.writeQueue = []

Caesium = function(dir){
  this.version = Pkg.version
  this.dir = dir
  this.pkg = this.getPackage()
  this.sourceMap = {}
  this.siteModule = null
  this.fileTypes = require('./caesium/file_types.json')

  this.setOptions()
}

Caesium.prototype.getPackage = function(){
  return require(path.join(this.dir, 'package.json'))
}

Caesium.prototype.setOptions = function () {
  this.options = defaults(this.pkg.caesium, {
    destination: path.join(this.dir, 'public'),
    port: 5555,
    exclude: []
  })
  this.options.exclusions = [
    'node_modules',
    'package.json'
  ].concat(this.options.exclude, this.pkg.main)
  this.options.exclusions.push(this.options.destination.replace(this.dir + path.sep, ''))
  this.options.source = this.dir

  this.sourceMap = new SourceMap(this.dir, this.options.exclusions, this.handlers)
}

Caesium.prototype.buildSourceMap = function(){
  return this.sourceMap.build()
}

Caesium.prototype.getSiteModule = function(){
  this.siteModule = require(path.join(this.dir, this.pkg.main))
  process.caesiumClient = new Client(this.siteModule)
}

Caesium.prototype.buildFileObjects = function(){
  return this.sourceMap.buildObjects()
}

Caesium.prototype.buildPaths = function(){
  return this.sourceMap.buildPaths()
}

Caesium.prototype.createBuild = function(){
  this.build = new Build(this.options, this.sourceMap)
}

module.exports = Caesium
