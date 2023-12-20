import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cacheRequestConfig: [],
  },
  getters: {
    cacheRequestConfig (state) {
      return state.cacheRequestConfig
    },
  },
  mutations: {
    SET_CACHE_REQUEST_CONFIG (state, payload) {
      state.cacheRequestConfig = payload
    },
  },
  actions: {},
  modules: {},
})
