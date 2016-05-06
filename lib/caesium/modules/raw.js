fs = require('fs')
path = require('path')

mkdirp = require('mkdirp')

module.exports = {
  fileTypes: [],
  parseWeight: 0,
  displayName: 'Raw',

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
