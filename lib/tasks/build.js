Progress = require('progress')

module.exports = function(caesium, cb){
  bar = new Progress('Building :bar :elapsedS', {
    total: 10,
    callback: cb
  })

  caesium.modules.loadModules()
  bar.tick()

  caesium.getSiteModule()
  bar.tick()

  caesium.buildSourceMap().then(function(map){
    bar.tick()
    caesium.buildFileObjects().then(function(){
      bar.tick()
      caesium.buildPaths().then(function(){
        bar.tick()
        caesium.createBuild()
        caesium.build.cleanBeforeRun().then(function(){
          bar.tick()
          caesium.build.run().then(function(){
            bar.tick()
            caesium.build.writeReactFiles().then(function(){
              bar.tick()
              caesium.build.buildBundle().then(function(){
                bar.tick()
                caesium.build.cleanAfterRun().then(function(){
                  bar.tick()
                })
              }).catch(handleError)
            }).catch(handleError)
          }).catch(handleError)
        }).catch(handleError)
      }).catch(handleError)
    }).catch(handleError)
  }).catch(handleError)
}

handleError = function(err){
  console.log('Something went wrong!')
  console.dir(err)
  caesium.build.cleanAfterRun().then(function(){
    console.log('cleaned up')
  })
}
