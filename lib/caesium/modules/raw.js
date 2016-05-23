StaticView = require('../../react/static')

fs = require('fs')
path = require('path')

mkdirp = require('mkdirp')

module.exports = {
  fileTypes: [],
  parseWeight: 0,
  displayName: 'Raw',
  skipInProps: true,

  createRoute: function(fileObject){
    route = fileObject.descriptor
    target = fileObject.descriptor
    folder = target.replace(/\/[^/.]+\.[^/.]+$/, "")

    return {
      path: route,
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
        if(fileObject.frontMatter.module == 'Raw'){
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
        }else{
          readStream = fs.createReadStream(path.join(options.source, fileObject.descriptor), {flags: 'r', encoding: 'binary'})
          writeStream = fs.createWriteStream(path.join(options.destination, fileObject.paths.targetFile), {flags: 'w', encoding: 'binary'})

          readStream.pipe(writeStream)
        }

        resolve()
      })
    })
  }
}
