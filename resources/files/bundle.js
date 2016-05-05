CaesiumClient = require('caesium/client')

siteModule = require('./')

window.caesiumClient = new CaesiumClient(siteModule)

window.caesiumClient.boot(window.caesiumProps)
