/* eslint-disable no-console */
export const state = () => ({
  token: null,
  user: null
})

export const mutations = {
  setToken (state, token) {
    state.token = token
  },
  setUser (state, user) {
    state.user = user
  },
  clearAuthData (state) {
    state.token = null
    state.user = null
  }
}

export const actions = {
  async login ({ commit, dispatch }, authData) {
    try {
      const response = await this.$axios.post('https://api.tanefer.com/api/v2/auth/login', {
        email: authData.email,
        password: authData.password
      })
      const token = response.data.data.token
      commit('setToken', token)
      this.$axios.setToken(token, 'Bearer')
      localStorage.setItem('authToken', token)
      await dispatch('fetchUser')
    } catch (error) {
      console.error('Error during login:', error)
    }
  },
  async register ({ commit, dispatch }, authData) {
    try {
      const response = await this.$axios.post('https://api.tanefer.com/api/v2/auth/register', {
        email: authData.email,
        password: authData.password
      })
      const token = response.data.data.token
      commit('setToken', token)
      this.$axios.setToken(token, 'Bearer')
      localStorage.setItem('authToken', token)
      await dispatch('fetchUser')
    } catch (error) {
      console.error('Error during registration:', error)
    }
  },
  async fetchUser ({ commit }) {
    try {
      const response = await this.$axios.get('https://api.tanefer.com/api/v2/auth/user')
      const user = response.data
      commit('setUser', user)
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  },
  logout ({ commit }) {
    commit('clearAuthData')
    this.$axios.setToken(false)
    localStorage.removeItem('authToken')
  }
}

export const getters = {
  isAuthenticated (state) {
    return state.token !== null
  },
  user (state) {
    return state.user
  }
}
