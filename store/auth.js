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
      const token = localStorage.getItem('authToken')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await this.$axios.get('https://api.tanefer.com/api/v2/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.status) {
        const user = response.data.data

        commit('setUser', user)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  },

  async logout ({ commit }) {
    try {
      const token = localStorage.getItem('authToken')

      if (token) {
        await this.$axios.post('https://api.tanefer.com/api/v2/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }

      commit('clearAuthData')
      if (process.client) {
        localStorage.removeItem('authToken')
      }
      this.$axios.setToken(false)

      this.$router.push('/')
    } catch (error) {
      console.error('Error during logout:', error)
    }
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
