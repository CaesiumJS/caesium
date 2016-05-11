Caesium = require('../')

expect = require('chai').expect
rimraf = require('rimraf')

fs = require('fs')
path = require('path')

describe('Caesium', function(){
  caesium = null

  it('should require the sites package.json', function(){
    caesium = new Caesium(path.join(__dirname, 'example'))
    expect(caesium.options.port).to.equal(5556)
  })

  it('should set the default options', function(){
    expect(caesium.pkg.caesium.destination).to.equal(path.join(__dirname, 'example', 'public'))
    expect(caesium.options.exclusions[0]).to.equal('node_modules')
    expect(caesium.options.exclusions.indexOf('public')).not.to.equal(-1)
  })

  describe('Module Loader', function(){
    it('should load the internal modules', function(){
      caesium.modules.loadModules()
      wrap = caesium.modules.getModuleForType('html')
      expect(typeof wrap).not.to.equal('undefined')
    })
  })

  describe('Loading local js', function(){
    it('should load the sites main js file', function(){
      caesium.getSiteModule()

      expect(caesium.siteModule.loaded).to.equal(true)
    })
  })

  describe('Source Map', function(){
    it('should create a file descriptor', function(){
      descriptor = caesium.sourceMap.getFileDescriptor(['files', 'node_modules', '.bin'], 'caesium.js')
      expect(descriptor).to.equal("node_modules/.bin/caesium.js")
    })

    it('should build the source map', function(done){
      caesium.buildSourceMap().then(function(map){
        expect(map.base).to.equal(path.join(__dirname, 'example'))
        expect(map.files['assets/style.css'].parsed).to.equal(false)
        expect(map.files.node_modules).to.be.a('undefined')
        done()
      })
    })

    it('should let you iterate over the source map', function(done){
      caesium.sourceMap.iterate(function(fileObject, finish){
        expect(fileObject.parsed).to.equal(false)
        finish()
      }).then(function(){
        done()
      })
    })
  })

  describe('File Object Building', function(){
    it('should build the file object', function(done){
      caesium.buildFileObjects().then(function(){
        caesium.sourceMap.iterate(function(fileObject, finish){
          expect(fileObject.parsed).to.equal(true)
          finish()
        }).then(function(){
          done()
        })
      })
    })

    it('should have worked out the type', function(){
      expect(caesium.sourceMap.map.files['assets/style.css'].ext).to.equal('css')

    })
  })

  describe('Path Building', function(){
    it('should build the paths', function(done){
      caesium.buildPaths().then(function(){
        expect(caesium.sourceMap.map.files['assets/style.css'].paths.route).to.equal('assets/style.css')
        done()
      })
    })

    it('should have pathed /pages/index.html to /', function(){
      expect(caesium.sourceMap.map.files['pages/index.html'].paths.route).to.equal('/')
      expect(caesium.sourceMap.map.files['pages/index.html'].paths.targetFile).to.equal('/index.html')
    })
  })

  describe('Modules', function(){
    describe('Raw', function(){
      it('should copy the file', function(done){
        rawModule = caesium.modules.getModuleForType('foobar')

        rimraf(path.join(__dirname, 'example', 'public', 'assets', 'style.css'), function(){
          fs.stat(path.join(__dirname, 'example', 'public', 'assets', 'style.css'), function(err, stat){
            expect(err.code).to.equal('ENOENT')
            rawModule.module.parseFile(caesium.sourceMap.map.files['assets/style.css'], caesium.options).then(function(){
              fs.stat(path.join(__dirname, 'example', 'public', 'assets', 'style.css'), function(err, stat){
                expect(err).to.equal(null)
                done()
              })
            })
          })
        })
      })
    })

    describe('Wrap', function(){
      it('should put the file into the write queue', function(done){
        wrapModule = caesium.modules.getModuleForType('.html')

        expect(process.writeQueue.length).to.equal(0)

        wrapModule.module.parseFile(caesium.sourceMap.map.files['pages/index.html'], caesium.options).then(function(){
          expect(process.writeQueue.length).to.equal(1)
          done()
        })
      })
    })

    describe('Markdown', function(){
      it('should put the file into the write queue', function(done){
        mdModule = caesium.modules.getModuleForType('.md')

        expect(process.writeQueue.length).to.equal(1)

        mdModule.module.parseFile(caesium.sourceMap.map.files['pages/about.md'], caesium.options).then(function(){
          expect(process.writeQueue.length).to.equal(2)
          done()
        })
      })
    })

    describe('Javascript', function(){
      it('should load the module', function(done){
        jsModule = caesium.modules.getModuleForType('.js')

        expect(process.writeQueue.length).to.equal(2)

        jsModule.module.parseFile(caesium.sourceMap.map.files['pages/react.js'], caesium.options).then(function(){
          expect(process.writeQueue.length).to.equal(3)
          expect(caesium.sourceMap.map.files['pages/react.js'].component).not.to.equal(null)
          done()
        })
      })
    })
  })

  describe('Building', function(){
    it('should have set a parse order in the last test', function(){
      expect(caesium.sourceMap.parseList[0][0].paths.route).to.equal('assets/style.css')
    })

    it('should clear the build dir', function(done){
      caesium.createBuild()

      caesium.build.cleanBeforeRun().then(function(){
        fs.stat(path.join(__dirname, 'example', 'public'), function(err, stat){
          expect(err).to.equal(null)
          fs.stat(path.join(__dirname, 'example', 'public', 'assets'), function(err, stat){
            expect(err.code).to.equal('ENOENT')
            done()
          })
        })
      })
    })

    it('should create all the files', function(done){
      caesium.build.run().then(function(){
        done()
      })
    })

    it('should write the react files', function(done){
      caesium.build.writeReactFiles().then(function(){
        done()
      })
    })

    it('should build the bundle', function(done){
      this.timeout(10000)

      caesium.build.buildBundle().then(function(){
        done()
      }).catch(function(err){
        console.dir(err)
      })
    })

    it('should clean up after a build', function(done){
      caesium.build.cleanAfterRun().then(function(){
        fs.stat(path.join(__dirname, 'example', '_caesium_bundle.js'), function(err, stat){
          expect(err.code).to.equal('ENOENT')
          done()
        })
      })
    })
  })
})
