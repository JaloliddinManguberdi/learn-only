import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const context = require.context('./modules', false, /\.js$/)
const modules = {}
context.keys().forEach(file => {
  const moduleName = file.replace(/(\.\/|\.js)/g, '')
  modules[moduleName] = context(file).default
  modules[moduleName].namespaced = true
})

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules,
})
