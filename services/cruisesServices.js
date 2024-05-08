import clientAPI from './axiosConfig'

// const baseURL = 'https://be.tanefer.com/api/v2'
// const baseURL = 'http://localhost:8000/api/v2'
// const baseURL = 'https://tanefer.nahrdev.com/api/v2'
const baseURL = 'https://api.tanefer.com/api/v2'
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
  },

  // get Meta
  getMetaData (metaId) {
    return clientAPI(baseURL).get(`/packages/seo/${metaId}`)
  },

  // get City Details
  getCityDetails (slug) {
    return clientAPI(baseURL).get(`/tours/getcitydetails/${slug}`)
  },

  // Calculate Cruise Price
  calculateCruiseAllPrice (id, payload) {
    return clientAPI(baseURL).post(`/cruises/${id}/select-room`, payload)
  }
}
