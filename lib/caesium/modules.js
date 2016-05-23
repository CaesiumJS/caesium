semver = require('semver')
sodb = require('sodb')
path = require('path')

ModuleVersions = require('../../resources/module_versions.json')

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
      if(Object.keys(ModuleVersions).indexOf(dep) != -1){
        if(semver.satisfies(deps[dep], ModuleVersions[dep])){
          _.requirePaths.push(path.join(dir, 'node_modules', dep))
        }else{
          console.log(dep + ' version ' + deps[dep] + ' needs updating before use with this caesium version.')
        }
      }else{
        console.log('caesium-* dep found but not in the module versions file, maybe update caesium?')
        _.requirePaths.push(path.join(dir, 'node_modules', dep))
      }
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

Modules.prototype.loadFromSiteModule = function(siteModule){
  _ = this
  if(siteModule.modules){
    Object.keys(siteModule.modules).forEach(function(key){
      mod = siteModule.modules[key]
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

Modules.prototype.runHooks = function(name, cae){
  _ = this
  return new Promise(function(resolve, reject) {
    promises = []
    _.modules.all().forEach(function(mod){
      if(typeof(mod.module[name]) == 'function'){
        promises.push(mod.module[name](cae))
      }
    })

    Promise.all(promises).then(function(){
      resolve()
    })
  })
}

module.exports = Modules
