/* eslint-disable no-shadow */
// import { mdiAxis, mdiAxisLock } from '@mdi/js'
import axios from 'axios'

const state = () => ({
  posts: [],
  params: {},
  totalPages: 1,
})

const getters = {
  getItems: state => state.posts,
  getTotalPages: state => state.totalPages,
}

const mutations = {
  SET_PARAMS: (state, params) => {
    state.params = params
  },
  SET_TOTAL_PAGE: (state, pages) => {
    state.totalPages = pages
  },

  // CRUD only
  SET_POSTS: (state, posts) => {
    state.posts = posts
  },
  ADD_POST: (state, post) => {
    state.posts.unshift(post)
  },
  UPDATE_POST: (state, post) => {
    const index = state.posts.findIndex(p => p.id === post.id)
    if (index > -1) {
      // Vue.set(state.posts, index, post)
      state.posts.splice(index, 1, post)
    }
  },
  DELETE_POST: (state, post) => {
    const index = state.posts.findIndex(p => p.id === post.id)
    if (index > -1) {
      // Vue.delete(state.posts, index)
      state.posts.splice(index, 1)
    }
  },
}

const actions = {
  async fetchPosts({ commit }, params) {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts', { params })
      commit('SET_POSTS', response.data)
      commit('SET_TOTAL_PAGE', Math.ceil(+response.headers['x-total-count'] / 10 || 1))

      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async createPosts({ commit }, post) {
    try {
      const { data } = await axios.post('https://jsonplaceholder.typicode.com/posts', post)
      commit('ADD_POST', data)

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async updatePost({ commit }, post) {
    try {
      const { data } = await axios.put('https://jsonplaceholder.typicode.com/posts/${post.id}', post)
      commit('UPDATE_POST', data)

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async deletePost({ commit }, post) {
    try {
      await axios.delete('https://jsonplaceholder.typicode.com/posts/${post.id}', post)
      commit('DELETE_POST', post)

      return Promise.resolve(post)
    } catch (error) {
      return Promise.reject(error)
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
