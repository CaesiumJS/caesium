---
title: 'React'
layout: 'page'
---

React = require('react')

module.exports = React.createClass({
  loaded: true,
  displayName: 'React Page',

  render: function(){
    return React.DOM.div({},
      React.DOM.h1({}, 'React Page'),
      React.DOM.p({}, 'A Page made with React!')
    )
  }
})
