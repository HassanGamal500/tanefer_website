import clientAPI from './axiosConfig'

// const baseURL = 'https://be.tanefer.com/api/v2'
// const baseURL = 'http://localhost:8000/api/v2'
// const baseURL = 'https://tanefer.nahrdev.com/api/v2'
const baseURL = 'https://api.tanefer.com/api/v2'
export default {
  // get all cities for search
  getCities () {
    return clientAPI(baseURL).get('/tours/list-city')
  },

  // get top tours for packages page
  getTopTours () {
    return clientAPI(baseURL).get('/packages/top-packages')
  },

  // get city trips
  getCityTrips (cityId) {
    return clientAPI(baseURL).get(`/packages/search/${cityId}?page=1&row_per_page=100`)
  },

  // get city trips filters
  getCityTripsFilters (cityId) {
    return clientAPI(baseURL).get(`/packages/filter/${cityId}`)
  },

  // get trip destails
  getTripDetails (tripId) {
    return clientAPI(baseURL).get(`/packages/details/${tripId}`)
  },

  // get trip destails
  getSavedTripDetails (token) {
    return clientAPI(baseURL).get(`/packages/custom-package?custom_package=${token}`)
  },

  // get trip hotels
  getTripHotels (id, checkinDate, checkoutDate, Rooms, Adults, Children) {
    return clientAPI(baseURL).get(`/hotels?city_id=${id}&checkin_date=${checkinDate}&checkout_date=${checkoutDate}&Rooms=${Rooms}&adult_number=${Adults}&child_number=${Children}`)
  },

  // get trip hotel details
  getTripHotelDetails (id, Rooms, Adults, Children, Childrenages) {
    return clientAPI(baseURL).get(`/hotels/details/${id}?Rooms=${Rooms}&adult_number=${Adults}&child_number=${Children}&Childrenages=${Childrenages}`)
  },

  // get trip activities
  getTripActivities (id, puplish) {
    return clientAPI(baseURL).get(`/packages/activity?city_id=${id}&for_package=${puplish}`)
  },

  // // get trip activity details
  // getTripActivityDetails (id, Rooms, Adults, Children, Childrenages) {
  //   return clientAPI(baseURL).get(`/hotels/details/${id}?Rooms=${Rooms}&adult_number=${Adults}&child_number=${Children}&Childrenages=${Childrenages}`)
  // },

  // get trip total price
  getTripTotalPrice (payload) {
    return clientAPI(baseURL).post('/packages/calculate-total-price', payload)
  },

  // save trip
  saveTrip (payload) {
    return clientAPI(baseURL).post('/packages/save', payload)
  },

  // send trip by email
  saveToMail (payload) {
    return clientAPI(baseURL).post('/packages/save-to-email', payload)
  },
  // book Trip
  bookTrip (id, payload) {
    return clientAPI(baseURL).post(`/packages/complete/${id}`, payload)
  },

  // confirm trip booking
  confirmTripBooking (query) {
    return clientAPI(baseURL).get(`/packages/confirm-booking?${query}`)
  },

  // get hotel destails
  getGtaHotelDetails (jpdCode) {
    return clientAPI(baseURL).get(`/packages/get-content?hotelCode=${jpdCode}`)
  },

  checkHotelAvailabilities (payload) {
    return clientAPI(baseURL).post('/packages/get-availability', payload)
  },

  checkHotelAvailabilitiesTest (payload) {
    return clientAPI(baseURL).post('/packages/get-availabilityRS-test', payload)
  },

  getBookingRules (payload) {
    return clientAPI(baseURL).post('/packages/get-booking-rules', payload)
  },

  finalBookHotel (payload) {
    return clientAPI(baseURL).post('/packages/get-booking', payload)
  },

  // get Meta
  getMetaData (metaId) {
    return clientAPI(baseURL).get(`/packages/seo/${metaId}`)
  },

  // get City Details
  getCityDetails (slug) {
    return clientAPI(baseURL).get(`/tours/getcitydetails/${slug}`)
  },

  // get Hotel Catalogue Data
  getHotelCatalogueData () {
    return clientAPI(baseURL).get('/packages/get-hotel-catalogue-data')
  }
}
