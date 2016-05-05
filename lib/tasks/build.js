Progress = require('progress')

module.exports = function(caesium, cb){
  bar = new Progress('Building :bar :elapsedS', {
    total: 8,
    callback: cb
  })

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
              })
            })
          })
        })
      })
    })
  })
}
