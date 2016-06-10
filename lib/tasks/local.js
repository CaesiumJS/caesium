build = require('./build')

StaticServer = require('static-server')
chokidar = require('chokidar')

module.exports = function(caesium){
  server = new StaticServer({
    port: caesium.options.port,
    name: 'Caesium Server',
    rootPath: caesium.options.destination
  })

  build(caesium, function(){
    server.start(function(){
      console.log('Listening on port ' + caesium.options.port)
    })

    process.building = false

    chokidar.watch(caesium.dir, {
      ignored: [
        /node_modules/,
        caesium.options.destination
      ]
    }).on('change', function(path, event){
      process.bundleModules = []
      Object.keys(require.cache).forEach(function(key){
        if(key.indexOf(caesium.dir) != -1){
          delete require.cache[key]
        }
      })

      if(process.building == false){
        process.building = true
        build(caesium, function(){
          process.building = false
        })
      }
    })
  })
}
