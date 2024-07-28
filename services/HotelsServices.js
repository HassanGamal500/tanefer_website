import clientAPI from './axiosConfig'

// const baseURL = 'https://be.tanefer.com/api'
// const baseURL = 'http://localhost:8000/api/v2'
// const baseURL = 'https://tanefer.nahrdev.com/api/v2'
const baseURL = 'https://api.tanefer.com/api/v2'
export default {
  // get cities
  getCities (term) {
    return clientAPI(baseURL).get(`/cities/autocomplete?term=${term}`)
    // return clientAPI(baseURL).get(`/tours/city/autocomplete?term=${term}`)
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
  },
  // get Meta
  getMetaData (metaId) {
    return clientAPI(baseURL).get(`/packages/seo/${metaId}`)
  },
  // get City Details
  getCityDetails (slug) {
    return clientAPI(baseURL).get(`/tours/getcitydetails/${slug}`)
  },

  getGtaCountries () {
    return clientAPI(baseURL).get('/packages/gta-get-country')
  },
  getGtaCatalogues () {
    return clientAPI(baseURL).get('/packages/gta-get-hotel-catalogues')
  },
  getGtaHotelCategories () {
    return clientAPI(baseURL).get('/packages/gta-get-hotel-categories')
  },
  getGtaHotelTypeCategories () {
    return clientAPI(baseURL).get('/packages/gta-get-hotel-type-categories')
  },
  getGtaCategories () {
    return clientAPI(baseURL).get('/packages/gta-get-room-categories')
  },
  getGtaBoards () {
    return clientAPI(baseURL).get('/packages/gta-get-boards')
  },
  getGtaCities (id) {
    return clientAPI(baseURL).get(`/packages/gta-get-city?country_code=${id}`)
  },
  getGtaHotels (id) {
    return clientAPI(baseURL).get(`/packages/gta-get-hotel?city_id=${id}`)
  },
  checkHotelAvailabilities (payload) {
    return clientAPI(baseURL).post('/packages/get-availability', payload)
  },
  getGtaHotelDetails (jpdCode) {
    return clientAPI(baseURL).get(`/packages/get-content?hotelCode=${jpdCode}`)
  },
  getBookingRules (payload) {
    return clientAPI(baseURL).post('/packages/get-booking-rules', payload)
  },
  finalBookHotel (payload) {
    return clientAPI(baseURL).post('/packages/get-booking', payload)
  },
  saveHotel (payload) {
    return clientAPI(baseURL).post('/hotels/save', payload)
  }
}
