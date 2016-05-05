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
      fileObject.content = Marked(fileObject.rawBody)

      //fileObject.body = ReactDOMServer.renderToString(React.createElement(HTMLView, {body: fileObject.markedBody, title: fileObject.frontMatter.title, frontMatter: fileObject.frontMatter}))

      process.writeQueue.push(fileObject)
      resolve()
    })
  },

  getPaths: function(fileObject){
    route = fileObject.descriptor.replace(/\.[^/.]+$/, "")
    target = route + "/index.html"
    folder = target.replace(/\/[^/.]+\.[^/.]+$/, "")

    return {
      route: route,
      targetFile: target,
      folder: folder
    }
  }
}
