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

    chokidar.watch(caesium.dir, {
      ignored: [
        /node_modules/,
        caesium.options.destination
      ]
    }).on('change', function(path, event){
      if(require.cache[path]){
        delete require.cache[path]
      }
      build(caesium)
    })
  })
}
