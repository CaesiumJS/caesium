FrontMatter = require('front-matter')
Mime = require('mime')
Promise = require('bluebird')

fs = require('fs')
path = require('path')

SourceMap = function(dir, exclusions, handlers){
  this.dir = dir
  this.exclusions = exclusions
  this.map = {
    base: dir,
    files: {}
  }
  this.handlers = handlers
  this.parseList = {}
}

SourceMap.prototype.build = function () {
  this.map = {
    base: this.dir,
    files: {}
  }

  return this.mapDir(this.dir, ['files'])
}

SourceMap.prototype.mapDir = function (dir, mapPath){
  _ = this
  promise = new Promise(function(resolve, reject) {
    fs.readdir(dir, function(err, contents){
      promises = []

      contents.forEach(function(content){
        stat = fs.statSync(path.join(dir, content))
        descriptor = _.getFileDescriptor(mapPath, content)
        if(_.exclusions.indexOf(descriptor) == -1){
          if(stat && stat.isDirectory()){
            subDirPath = mapPath.slice()
            subDirPath.push(content)
            promises.push(_.mapDir(path.join(dir, content), subDirPath))
          }else{
            _.map.files[descriptor] = {
              parsed: false,
              descriptor: descriptor
            }
          }
        }
      })

      Promise.all(promises).then(function(){
        resolve(_.map)
      })
    })
  })

  return promise
}

SourceMap.prototype.getFileDescriptor = function(mapPath, content) {
  filePath = mapPath.slice()
  filePath.shift()
  filePath.push(content)

  return filePath.join('/')
}

SourceMap.prototype.iterate = function(perObject){
  _ = this
  return new Promise(function(resolve, reject) {
    files = Object.keys(_.map.files)
    promises = []
    files.forEach(function(file){
      promises.push(new Promise(function(res, rej){
        perObject(_.map.files[file], res, rej)
      }))
    })

    Promise.all(promises).then(function(){
      resolve()
    })
  });
}

SourceMap.prototype.buildObjects = function () {
  _ = this
  return this.iterate(function(fileObject, done){
    fs.readFile(path.join(_.map.base, fileObject.descriptor), function(err, data){
      content = FrontMatter(data.toString())

      fileObject.mime = Mime.lookup(fileObject.descriptor)

      fileObject.parsed = true
      fileObject.rawBody = content.body
      fileObject.frontMatter = content.attributes

      fileObject.mime = Mime.lookup(fileObject.descriptor)
      fileObject.ext = Mime.extension(fileObject.mime)

      done()
    })
  })
}

module.exports = SourceMap
