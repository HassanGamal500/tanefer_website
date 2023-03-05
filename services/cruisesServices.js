import clientAPI from './axiosConfig'

const baseURL = 'https://be.tanefer.com/api/v2'
export default {
  // get city cruises
  getCityCruises (cityId, page, limit) {
    return clientAPI(baseURL).get(`/cruises?city_id=${cityId}&page=${page}&row_per_page=${limit}`)
  },

  // get cruise details
  getCruiseDetails (id) {
    return clientAPI(baseURL).get(`/cruises/${id}`)
  },

  // check cruise availablity
  checkCruiseAvailablity (id, term) {
    return clientAPI(baseURL).get(`/cruises/${id}/availability?${term}`)
  },

  // calculate cruise price
  calculateCruisePrice (id, payload) {
    return clientAPI(baseURL).post(`/cruises/${id}/calculate-price`, payload)
  },

  // book cruise
  bookCruise (id, payload) {
    return clientAPI(baseURL).post(`/cruises/${id}/booking`, payload)
  }
}
