React = require('react')
ReactDOM = require('react-dom')
HTMLView = require('../react/html')
StaticView = require('../react/static')

Client = function(siteModule){
  this.siteModule = siteModule
}

Client.prototype.getLayoutClass = function(name) {
  return this.siteModule.layouts[name]
}

Client.prototype.getComponentFromProps = function(props){
  if(props.component == StaticView.displayName){
    return StaticView
  }else{
    return window.caesiumModules[props.component]
  }
}

Client.prototype.boot = function(props){
  console.log('Welcome to Caesium')

  _ = this
  document.addEventListener("DOMContentLoaded", function(event) {
    ReactDOM.render(React.createElement(
      _.getLayoutClass(props.frontMatter.layout),
      props,
      React.createElement(_.getComponentFromProps(props), props)
    ), document.getElementById('caesium-mount'))
  })
}

module.exports = Client
