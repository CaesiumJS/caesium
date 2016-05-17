StaticView = require('../../react/static')

module.exports = {
  fileTypes: [
    ".html",
    ".htm"
  ],
  parseWeight: 10,
  displayName: 'Wrap',

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
      target = route.replace(/\.js$/, '.html')
    }

    folder = target.replace(/\/[^/.]+\.[^/.]+$/, "")

    return {
      path: route,
      targetFile: target,
      folder: folder
    }
  },

  getComponent: function(){
    return StaticView
  },

  parseFile: function(fileObject, options){
    return new Promise(function(resolve, reject) {
      fileObject.content = fileObject.rawBody

      process.writeQueue.push(fileObject)

      resolve()
    })
  }
}
