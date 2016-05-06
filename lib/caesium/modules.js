sodb = require('sodb')

Modules = function(deps){
  this.requirePaths = [
    './modules/raw',
    './modules/wrap',
    './modules/markdown'
  ]

  this.modules = new sodb({cache: true})

  Object.keys(deps).forEach(function(dep){
    // TODO: If module matches /^caesium-/ add it to the require paths
  })
}

Modules.prototype.loadModules = function (){
  _ = this
  this.requirePaths.forEach(function(requirePath){
    mod = require(requirePath)

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

module.exports = Modules
