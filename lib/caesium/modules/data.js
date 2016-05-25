path = require('path')

module.exports = {
  fileTypes: [
    '.json'
  ],
  parseWeight: 5,
  displayName: 'Data',

  createRoute: function(fileObject){
    return {}
  },

  getComponent: function(){
    return {}
  },

  parseFile: function(fileObject, options){
    return new Promise(function(resolve, reject){
      key = path.basename(fileObject.descriptor).replace(path.extname(fileObject.descriptor), '')
      process.dataProps[key] = require(path.join(options.source, fileObject.descriptor))
      resolve()
    })
  }
}
