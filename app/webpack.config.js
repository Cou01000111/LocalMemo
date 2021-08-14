module.exports = {
  mode: "development",
  entry: "./src/js/main.js",
  output: {
    filename: "bundle.js"
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.js'
    }
  }
}
