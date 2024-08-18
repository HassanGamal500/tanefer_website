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
      return { success: true }
    } catch (error) {
      console.error('Error during login:', error)
      let message = 'An error occurred during login. Please try again.'

      if (error.response) {
        const { status, data } = error.response
        if (status === 401) {
          message = 'Invalid credentials. Please check your email and password.'
        } else if (status === 422 && data.data) {
          message = data.data // Use data from response
        } else if (data.message) {
          message = data.message
        }
      }

      return { success: false, message }
    }
  },

  async register ({ commit, dispatch }, authData) {
    try {
      const response = await this.$axios.post('https://api.tanefer.com/api/v2/auth/register', {
        username: authData.username,
        email: authData.email,
        phone: authData.phone,
        password: authData.password,
        password_confirmation: authData.password_confirmation
      })
      const token = response.data.data.token
      commit('setToken', token)
      this.$axios.setToken(token, 'Bearer')
      localStorage.setItem('authToken', token)
      await dispatch('fetchUser')
      return { success: true }
    } catch (error) {
      console.error('Error during registration:', error)
      let message = 'An error occurred during registration. Please try again.'

      if (error.response) {
        const { status, data } = error.response
        if (status === 422 && data.data) {
          message = data.data // Use data from response
        } else if (data.message) {
          message = data.message
        }
      }

      return { success: false, message }
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
