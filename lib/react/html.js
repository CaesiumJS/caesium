React = require('react')

module.exports = React.createClass({
  displayName: 'Caesium HTML',

  getComponentForLayout: function(){
    return caesiumClient.getLayoutClass(this.props.frontMatter.layout)
  },

  caesiumProps: function(){
    writeProps = this.props
    delete writeProps.children
    return "window.caesiumProps = " + JSON.stringify(writeProps)
  },

  render: function(){
    layoutClass = this.getComponentForLayout()

    return React.DOM.html({},
      React.DOM.head({},
        React.DOM.title({}, this.props.title)
      ),
      React.DOM.body({},
        React.DOM.div({id: 'caesium-mount', dangerouslySetInnerHTML: {__html: this.props.children}}),
        React.DOM.script({src: '/bundle.js'}),
        React.DOM.script({dangerouslySetInnerHTML: {__html: this.caesiumProps()}}),
        React.DOM.script({dangerouslySetInnerHTML: {__html: 'window.caesiumClient = new window.CaesiumClient(window.siteModule); window.caesiumClient.boot(window.caesiumProps);'}})
      )
    )
  }
})
