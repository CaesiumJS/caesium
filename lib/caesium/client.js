React = require('react')
ReactDOM = require('react-dom')
HTMLView = require('../react/html')
StaticView = require('../react/static')

/*
Creates a new client.

Takes the sites siteModule as an option.
*/
Client = function(siteModule){
  this.siteModule = siteModule
}

/*
getLayoutClass(name)

Get the requested layout class from the site module
*/
Client.prototype.getLayoutClass = function(name) {
  return this.siteModule.layouts[name]
}

/*
getComponentFromProps(props)

Gets the layout component from the props object
*/
Client.prototype.getComponentFromProps = function(props){
  if(props.component == StaticView.displayName){
    return StaticView
  }else{
    return window.caesiumModules[props.component]
  }
}

/*
boot(props)

On DOMContentLoaded mount the React site to #caesium-mount. Takes the props from the window.
*/
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
