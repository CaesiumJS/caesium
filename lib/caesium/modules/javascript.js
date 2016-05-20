path = require('path')
vm = require('vm')

React = require('react')
ReactDOMServer = require('react-dom/server')

module.exports = {
  fileTypes: [
    ".js"
  ],
  parseWeight: 15,
  displayName: 'Javascript',

  createRoute: function(fileObject){
    if(fileObject.frontMatter.path){
      route = fileObject.frontMatter.path
      if(path.extname(route) == ''){
        target = route + 'index.html'
      }else{
        target = route
      }
    }else{
      route = fileObject.descriptor
      target = route.replace(/\.js$/, '/index.html')
      folder = target.replace(/\/[^/.]+\.[^/.]+$/, "")
      route = '/' + folder
    }

    folder = target.replace(/\/[^/.]+\.[^/.]+$/, "")

    return {
      path: route,
      targetFile: target,
      folder: folder
    }
  },

  getComponent: function(fileObject){
    sandbox = {
      require: require,
      module: {
        exports: null
      },
      caesiumClient: caesiumClient
    }
    vm.runInNewContext(fileObject.rawBody, sandbox)

    return sandbox.module.exports
  },

  parseFile: function(fileObject, options){
    return new Promise(function(resolve, reject){
      process.bundleModules.push([fileObject.router.component.displayName, fileObject.rawBody])
      process.writeQueue.push(fileObject)

      resolve()
    })
  }
}
