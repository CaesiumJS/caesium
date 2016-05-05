React = require('react')

module.exports = React.createClass({
  displayName: 'Caesium HTML',

  getComponentForLayout: function(){
    client = (process.caesiumClient || window.caesiumClient)

    return client.getLayoutClass(this.props.frontMatter.layout)
  },

  caesiumProps: function(){
    return "window.caesiumProps = " + JSON.stringify(this.props)
  },

  render: function(){
    layoutClass = this.getComponentForLayout()

    return React.DOM.html({},
      React.DOM.head({},
        React.DOM.title({}, this.props.title)
      ),
      React.DOM.body({},
        React.DOM.div({id: 'caesium-mount'},
          React.createElement(layoutClass, this.props)
        ),
        React.DOM.script({dangerouslySetInnerHTML: {__html: this.caesiumProps()}}),
        React.DOM.script({src: '/bundle.js'})
      )
    )
  }
})
