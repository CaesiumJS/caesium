React = require('react')

module.exports = React.createClass({
  displayName: 'Caesium Static',

  render: function(){
    return React.DOM.div({dangerouslySetInnerHTML: {__html: this.props.body}})
  }
})
