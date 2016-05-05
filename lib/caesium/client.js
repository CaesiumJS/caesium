React = require('react')
ReactDOM = require('react-dom')
ReactRouter = require('react-router')
HTMLView = require('../react/html')

Client = function(siteModule){
  this.siteModule = siteModule
}

Client.prototype.getLayoutClass = function(name) {
  return this.siteModule.layouts[name]
}

Client.prototype.boot = function(props){
  console.log('Welcome to Caesium')
  console.dir(props)

  ReactDOM.render(React.createElement(HTMLView, props), document)
}

module.exports = Client
