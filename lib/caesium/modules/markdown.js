Marked = require('marked')

module.exports = {
  fileTypes: [
    ".markdown",
    ".md"
  ],
  parseWeight: 10,
  displayName: 'Wrap',

  parseFile: function(fileObject, options){
    return new Promise(function(resolve, reject) {
      fileObject.content = Marked(fileObject.rawBody)

      process.writeQueue.push(fileObject)

      resolve()
    })
  }
}
