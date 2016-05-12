mkdirp = require('mkdirp')
path = require('path')
Progress = require('progress')

pkg = require(path.join(__dirname, '..', '..', 'package.json'))

module.exports = function(target){
  bar = new Progress('Writing Files :bar :elapsedS', {
    total: 3,
    callback: function(){
      console.log('\r\n')
    }
  })

  pkgJson = {
    name: 'Caesium Application',
    private: true,
    main: 'app.js',
    dependencies: {
      caesium: pkg.version
    }
  }

  basePath = path.resolve(target)
  mkdirp(basePath, function(err){
    bar.tick()
    fs.open(path.join(basePath, 'package.json'), 'w', function(err, fd){
      fs.writeFile(fd, JSON.stringify(pkgJson), function(err){
        bar.tick()

        fs
          .createReadStream(path.join(__dirname, '..', '..', 'resources', 'new', 'app.js'))
          .pipe(fs.createWriteStream(path.join(basePath, 'app.js')))

        bar.tick()
      })
    })
  })
}
