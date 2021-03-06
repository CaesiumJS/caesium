Remarkable = require('remarkable')
StaticView = require('../../react/static')

hljs = require('highlight.js')

module.exports = {
  fileTypes: [
    ".markdown",
    ".md"
  ],
  parseWeight: 10,
  displayName: 'Markdown',

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
      target = route.replace(path.extname(route), '/index.html')
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
    return StaticView
  },

  parseFile: function(fileObject, options){
    return new Promise(function(resolve, reject) {
      md = new Remarkable({
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, str).value
            } catch (err) {}
          }

          try {
            return hljs.highlightAuto(str).value
          } catch (err) {}

          return ''
        }
      })

      fileObject.content = md.render(fileObject.rawBody)

      process.writeQueue.push(fileObject)

      resolve()
    })
  }
}
