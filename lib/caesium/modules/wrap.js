module.exports = {
  fileTypes: [
    ".html",
    ".htm"
  ],
  parseWeight: 10,
  displayName: 'Wrap',

  parseFile: function(fileObject, options){
    return new Promise(function(resolve, reject) {
      fileObject.content = fileObject.rawBody

      process.writeQueue.push(fileObject)

      resolve()
    })
  }
}
