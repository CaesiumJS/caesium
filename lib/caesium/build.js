browserify = require('browserify')
crypto = require('crypto')
mkdirp = require('mkdirp')
Promise = require('bluebird')
rimraf = require('rimraf')

React = require('react')
ReactDOMServer = require('react-dom/server')

HTMLView = require('../react/html')
StaticView = require('../react/static')

Build = function(options, sourceMap){
  this.options = options
  this.sourceMap = sourceMap
}

Build.prototype.cleanBeforeRun = function() {
  _ = this
  return new Promise(function(resolve, reject) {
    rimraf(_.options.destination, {glob: false}, function(err){
      if(err){ reject(err) }
      mkdirp(_.options.destination, function(err){
        if(err){ reject(err) }
        resolve()
      })
    })
  })
}

Build.prototype.run = function(){
  _ = this
  return new Promise(function(resolve, reject){
    promises = []

    Object.keys(_.sourceMap.parseList).forEach(function(key){
      _.sourceMap.parseList[key].forEach(function(fileObject){
        promises.push(new Promise(function(res, rej){
          fileObject.module.module.parseFile(fileObject, _.options).then(function(){
            res()
          })
        }))
      })
    })

    Promise.all(promises).then(function(){
      resolve()
    })
  })
}

Build.prototype.buildBundle = function(){
  _ = this
  fs
    .createReadStream(path.join(__dirname, '..', '..', 'resources', 'files', 'bundle.js'))
    .pipe(fs.createWriteStream(path.join(this.options.source, '_caesium_bundle.js')))

  contents = "module.exports = {\r\n"
  used = []
  process.bundleModules.forEach(function(mod){
    if(used.indexOf(mod[0]) == -1){
      fileHash = crypto.createHash('md5').update(mod[1], 'utf8').digest('hex')

      contents += "\t'" + mod[0] + "': require('./_caesium_mod-" + fileHash + "'),\r\n"
      fs.writeFileSync(path.join(_.options.source, "_caesium_mod-" + fileHash + ".js"), mod[1])
    }
    used.push(mod[0])
  })
  contents += "}\r\n"
  fs.writeFileSync(path.join(this.options.source, '_caesium_modules.js'), contents)

  return new Promise(function(resolve, reject){
    if(!process.bundle){
      process.bundle = browserify(path.join(_.options.source, '_caesium_bundle.js'), {
        debug: true,
        extensions: process.bundleExtensions
      })
      process.bundleTransforms.forEach(function(transform){
        process.bundle.transform(transform)
      })
      process.bundle.on('reset', function(){
        process.bundle.emit('update', process.bundleFiles)
      })
      process.bundle.on('file', function(file, id, parent){
        process.bundleFiles.push(id)
      })
    }
    pipe = process.bundle.bundle()
    pipe.on('error', function(err){ reject(err) })
    pipe.on('end', function(){
      rimraf(path.join(_.options.source, '_caesium_bundle.js'), {glob: false}, function(err){
        resolve()
      })
    })
    pipe.pipe(fs.createWriteStream(path.join(_.options.destination, 'bundle.js')))
  })
}

Build.prototype.writeReactFiles = function(){
  _ = this

  return new Promise(function(resolve, reject) {
    promises = []
    process.writeQueue.forEach(function(fileObject){
      promises.push(new Promise(function(res, rej){
        props = _.createProps(fileObject)

        body = ReactDOMServer.renderToString(
          React.createElement(
            caesiumClient.getLayoutClass(props.frontMatter.layout),
            props,
            React.createElement(fileObject.router.component, props)
          )
        )
        fileObject.body = ReactDOMServer.renderToString(
          React.createElement(
            HTMLView,
            props,
            body
          )
        )

        mkdirp(path.join(_.options.destination, fileObject.paths.folder), function(err){
          if(err){ rej(err) }
          fs.open(path.join(_.options.destination, fileObject.paths.targetFile), 'w', function(err, fd){
            if(err){ rej(err) }
            fs.writeFile(fd, fileObject.body, {}, function(err){
              if(err){ reject(err) }
              fs.close(fd, function(err){
                if(err){ rej(err) }
                res()
              })
            })
          })
        })
      }))
    })

    Promise.all(promises).then(function(){
      resolve()
    })
  })
}

Build.prototype.createProps = function(fileObject){
  files = []

  _= this
  Object.keys(this.sourceMap.map.files).forEach(function(key){
    object = _.sourceMap.map.files[key].frontMatter
    if(!_.sourceMap.map.files[key].module.module.skipInProps){
      object.content = _.sourceMap.map.files[key].content
      object.path = _.sourceMap.map.files[key].paths.path

      files.push(object)
    }
  })

  return {
    body: fileObject.content,
    title: fileObject.frontMatter.title,
    frontMatter: fileObject.frontMatter,
    files: files,
    component: fileObject.router.component.displayName,
    data: process.dataProps
  }
}

Build.prototype.cleanAfterRun = function(){
  _ = this
  return new Promise(function(resolve, reject){
    rimraf(path.join(_.options.source, '_caesium_bundle.js'), {glob: false}, function(err){
      rimraf(path.join(_.options.source, '_caesium_modules.js'), {glob: false}, function(err){
        rimraf(path.join(_.options.source, '_caesium_mod-*.js'), {}, function(err){
          resolve()
        })
      })
    })
  })
}

module.exports = Build
