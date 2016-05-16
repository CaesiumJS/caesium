module.exports = {
  loaded: true,

  layouts: {
    page: require('./components/layouts/page'),
    coffee: require('./components/layouts/coffee.coffee')
  },

  headTags: {
    style: [
      '/assets/style.css'
    ]
  },

  modules: {
    Custom: require('./components/custom-module')
  }
}
