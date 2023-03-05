import clientAPI from './axiosConfig'

const baseURL = 'https://be.tanefer.com/api'
export default {
  // get cities
  getCities (term) {
    return clientAPI(baseURL).get(`/cities/autocomplete?term=${term}`)
  },

  // get city by code
  getCity (code) {
    return clientAPI(baseURL).get(`/cities/autocomplete?code=${code}&term=''`)
  },

  // get city hotels
  getCityHotels (term) {
    return clientAPI(baseURL).get(`/hotels/search?${term}`, {})
  },

  // get hotel rooms and details
  getHotelDetails (sessionId, hotelIndex, hotelCode) {
    return clientAPI(baseURL).get(`/hotels/show?sessionId=${sessionId}&hotelIndex=${hotelIndex}&hotelCode=${hotelCode}`, {})
  },

  // check hotel availablity
  checkHotelAvailablity (term) {
    return clientAPI(baseURL).get(`/hotels/roomsAvailabilityAndPricing?${term}`)
  },

  // book hotel
  bookHotel (payload) {
    return clientAPI(baseURL).post('/hotels/book', payload)
  }
}
