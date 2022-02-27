/* eslint-disable no-shadow */
// import { mdiAxis, mdiAxisLock } from '@mdi/js'
import axios from 'axios'

const state = () => ({
  users: [],
  params: {},
  totalPages: 1,
})

const getters = {
  getItems: state => state.users,
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
  SET_USERS: (state, users) => {
    state.users = users
  },
  ADD_USER: (state, user) => {
    state.users.unshift(user)
  },
  UPDATE_USER: (state, user) => {
    const index = state.users.findIndex(q => q.id === user.id)
    if (index > -1) {
      // Vue.set(state.users, index, user)
      state.users.splice(index, 1, user)
    }
  },
  DELETE_USER: (state, user) => {
    const index = state.users.findIndex(q => q.id === user.id)
    if (index > -1) {
      // Vue.delete(state.users, index)
      state.users.splice(index, 1)
    }
  },
}

const actions = {
  async fetchUsers({ commit }, params) {
    try {
      const response = await axios.get('http://localhost:3000/users', { params })
      commit('SET_USERS', response.data)
      commit('SET_TOTAL_PAGE', Math.ceil(+response.headers['x-total-count'] / 10 || 1))

      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  // Method: GET, POST, PUT, DELETE, PATCH, OPTIONS
  async createUser({ commit }, user) {
    try {
      const { data } = await axios.post('http://localhost:3000/users', user)
      commit('ADD_USER', data)

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async updateUser({ commit }, user) {
    try {
      const { data } = await axios.put(`http://localhost:3000/users/${user.id}`, user)
      commit('UPDATE_USER', data)

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async deleteUser({ commit }, user) {
    try {
      await axios.delete(`http://localhost:3000/users/${user.id}`, user)
      commit('DELETE_USER', user)

      return Promise.resolve(user)
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
