export default function ({ $axios, store, redirect }) {
  // Ensure this code runs only on the client side
  if (process.client) {
    // Set the token from localStorage on initial load
    const token = localStorage.getItem('authToken')
    if (token) {
      store.commit('auth/setToken', token)
      $axios.setToken(token, 'Bearer')
    }
  }

  $axios.onRequest((config) => {
    const token = store.state.auth.token
    if (token) {
      config.headers.common.Authorization = `Bearer ${token}`
    }
  })

  $axios.onError((error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch('auth/logout')
      redirect('/login')
    }
  })
}
