fs = require('fs')
path = require('path')

Marked = require('marked')
mkdirp = require('mkdirp')
React = require('react')
ReactDOMServer = require('react-dom/server')

HTMLView = require('../../react/html')

module.exports = {
  handle: function(fileObject, options){
    return new Promise(function(resolve, reject) {
      fileObject.content = fileObject.rawBody

      process.writeQueue.push(fileObject)

      resolve()
    })
  },

  getPaths: function(fileObject){
    if(fileObject.frontMatter.path){
      route = fileObject.frontMatter.path
      target = route + "index.html"
    }else{
      route = fileObject.descriptor
      target = route
    }
    folder = target.replace(/\/[^/.]+\.[^/.]+$/, "")

    return {
      route: route,
      targetFile: target,
      folder: folder
    }
  }
}
