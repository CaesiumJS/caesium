React = require('react')

module.exports = React.createClass({
  getInitialState: function(){
    return {loaded: "no"}
  },

  componentDidMount: function(){
    this.setState({loaded: "yes"})
  },

  render: function(){
    return React.DOM.div({className: 'page'},
      React.DOM.h1({}, this.props.title),
      React.DOM.div({},
        React.DOM.div({}, this.props.children),
        React.DOM.div({}, "Loaded: " + this.state.loaded)
      )
    )
  }
})
