fs = require('fs')
path = require('path')

mkdirp = require('mkdirp')

module.exports = {
  handle: function(fileObject, options){
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
