sodb = require('sodb')
path = require('path')

Modules = function(deps, dir){
  this.requirePaths = [
    './modules/raw',
    './modules/wrap',
    './modules/markdown',
    './modules/javascript'
  ]

  this.modules = new sodb({cache: true})

  _ = this
  Object.keys(deps).forEach(function(dep){
    if(dep.indexOf('caesium-') != -1){
      _.requirePaths.push(path.join(dir, 'node_modules', dep))
    }
  })
}

Modules.prototype.loadModules = function (){
  _ = this
  this.requirePaths.forEach(function(requirePath){
    mod = require(requirePath)
    if(typeof(mod.onRequire) == 'function'){
      mod.onRequire()
    }

    _.modules.add({
      displayName: mod.displayName,
      fileTypes: mod.fileTypes,
      module: mod
    })
  })
}

Modules.prototype.getModuleForType = function(type){
  mod = this.modules.findOne({fileTypes: {includes: type}})
  if(mod){
    return mod
  }else{
    return this.modules.findOne({displayName: 'Raw'})
  }
}

Modules.prototype.getModuleByName = function(name){
  return this.modules.findOne({displayName: name})
}

module.exports = Modules
