import axios from 'axios'

export const state = () => ({
  passengerTitle: '',
  passengerGender: '',
  passengerFirstName: '',
  passengerLastName: '',
  dateOfBirth: '',
  passExpireDate: '',
  passNum: '',
  issueCountry: ''
})

export const mutations = {
  SET_TRAVELLER_DATA (state, data) {
    state.passengerTitle = data.passenger_title
    state.passengerGender = data.passenger_gender
    state.passengerFirstName = data.passenger_first_name
    state.passengerLastName = data.passenger_last_name
    state.dateOfBirth = data.date_of_birth
    state.passExpireDate = data.pass_expire_date
    state.passNum = data.pass_num
    state.issueCountry = data.issue_country
  },
  CLEAR_TRAVELLER_DATA (state) {
    state.passengerTitle = ''
    state.passengerGender = ''
    state.passengerFirstName = ''
    state.passengerLastName = ''
    state.dateOfBirth = ''
    state.passExpireDate = ''
    state.passNum = ''
    state.issueCountry = ''
  }
}

export const actions = {
  async saveTravellerData ({ commit }, travellerData) {
    try {
      const token = localStorage.getItem('authToken')

      // Send the traveller data without needing to include user_id in the payload
      const response = await axios.post('https://api.tanefer.com/api/v2/auth/users/save-traveller-data', travellerData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.status === 200) {
        commit('SET_TRAVELLER_DATA', travellerData)
        return { success: true, message: 'Traveller data saved successfully' }
      }
    } catch (error) {
      return { success: false, message: error.response ? error.response.data.message : 'Failed to save traveller data' }
    }
  },

  async fetchTravellerData ({ commit }, userId) {
    try {
      const token = localStorage.getItem('authToken')

      const response = await axios.get(`https://api.tanefer.com/api/v2/auth/users/get-traveller-data/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.status === 200) {
        commit('SET_TRAVELLER_DATA', response.data.data)
        return { success: true, message: 'Traveller data retrieved successfully' }
      }
    } catch (error) {
      return { success: false, message: error.response ? error.response.data.message : 'Failed to fetch traveller data' }
    }
  },

  clearTravellerData ({ commit }) {
    commit('CLEAR_TRAVELLER_DATA')
  }
}

export const getters = {
  travellerData (state) {
    return {
      passengerTitle: state.passengerTitle,
      passengerGender: state.passengerGender,
      passengerFirstName: state.passengerFirstName,
      passengerLastName: state.passengerLastName,
      dateOfBirth: state.dateOfBirth,
      passExpireDate: state.passExpireDate,
      passNum: state.passNum,
      issueCountry: state.issueCountry
    }
  }
}
