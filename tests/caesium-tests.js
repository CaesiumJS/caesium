Caesium = require('../')

expect = require('chai').expect

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

  describe('Handlers', function(){
    describe('Raw', function(){
      rawHandler = require('../lib/caesium/handlers/raw')

      it('should copy the file', function(done){
        rawHandler.handle(caesium.sourceMap.map.files['assets/style.css'], caesium.options).then(function(){
          done()
        })
      })
    })

    describe('Markdown', function(){
      mdHandler = require('../lib/caesium/handlers/markdown')

      it('should parse the file', function(done){
        mdHandler.handle(caesium.sourceMap.map.files['pages/about.md'], caesium.options).then(function(){
          process.writeQueue.pop()
          done()
        })
      })
    })

    describe('Wrap', function(){
      wrapHandler = require('../lib/caesium/handlers/wrap')

      it('should parse the file', function(done){
        wrapHandler.handle(caesium.sourceMap.map.files['pages/index.html'], caesium.options).then(function(){
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
  })
})
