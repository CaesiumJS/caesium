React = require('react')

module.exports = React.createClass({
  render: ->
    React.DOM.div {className: 'coffee'},
      @props.children
})
