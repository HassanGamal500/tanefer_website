export const state = () => ({
  loading: false
})

export const mutations = {
  SET_LOADING (state, isLoading) {
    state.loading = isLoading
  }
}

export const actions = {
  startLoading ({ commit }) {
    commit('SET_LOADING', true)
  },
  stopLoading ({ commit }) {
    commit('SET_LOADING', false)
  }
}

export const getters = {
  isLoading: (state) => {
    return state.loading
  }
}
