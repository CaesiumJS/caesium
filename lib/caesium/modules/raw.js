StaticView = require('../../react/static')

fs = require('fs')
path = require('path')

mkdirp = require('mkdirp')

module.exports = {
  fileTypes: [],
  parseWeight: 0,
  displayName: 'Raw',

  createRoute: function(fileObject){
    route = fileObject.descriptor
    target = fileObject.descriptor
    folder = target.replace(/\/[^/.]+\.[^/.]+$/, "")

    return {
      route: route,
      targetFile: target,
      folder: folder
    }
  },

  getComponent: function(){
    return null
  },

  parseFile: function(fileObject, options){
    return new Promise(function(resolve, reject) {
      mkdirp(path.join(options.destination, fileObject.paths.folder), function(err){
        if(err){ reject(err) }
        fs.open(path.join(options.destination, fileObject.paths.targetFile), 'w', function(err, fd){
          if(err){ reject(err) }
          fs.writeFile(fd, fileObject.rawBody, {}, function(err){
            if(err){ reject(err) }
            fs.close(fd, function(err){
              if(err){ reject(err) }
              resolve()
            })
          })
        })
      })
    })
  }
}
