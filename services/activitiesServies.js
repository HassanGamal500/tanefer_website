import clientAPI from './axiosConfig'
import wpClientAPI from './axiosConfigWp'
import clientAuthAPI from './axiosAuthConfig'

// const baseURL = 'https://be.tanefer.com/api/v2'
// const baseURL = 'http://localhost:8000/api/v2'
// const baseURL = 'https://tanefer.nahrdev.com/api/v2'
const baseURL = 'https://api.tanefer.com/api/v2'
export default {
  // get city adventures
  getCityAdventures (cityId, puplish, date, activities) {
    return clientAPI(baseURL).get(`/packages/activities/search?city_id=${cityId}&for_package=${puplish}&date=${date}&activities=${activities}`)
  },

  // calculate adventure total price
  calculateAdventurePrice (payload) {
    return clientAPI(baseURL).post('/packages/activities/calculate-total-price', payload)
  },

  // calculate adventure total price
  calculateAdventureTotalPrices (payload) {
    return clientAPI(baseURL).post('/packages/activities/calculate-tour-total-price', payload)
  },

  // Validate Time Tour
  validateTimeTour (payload) {
    return clientAPI(baseURL).post('/packages/activities/validate-time-tour', payload)
  },

  // book adventure
  bookAdventure (payload) {
    return clientAuthAPI(baseURL).post('/packages/activities/book', payload)
  },

  // get durations
  getDurations (durationType) {
    return clientAPI(baseURL).get(`/packages/activities/duration/filter?duration_type=${durationType}`)
  },

  // get prices
  getPrices (payload) {
    return clientAPI(baseURL).get('/packages/activities/price/filter', payload)
  },

  // filter adventure
  filterAdventure (payload) {
    return clientAPI(baseURL).post('/packages/activities/search/filter', payload)
  },

  // calculate package total price
  calculatePackagePrice (payload) {
    return clientAPI(baseURL).post('/packages/calculate-all-price', payload)
  },

  // get Meta
  getMetaData (metaId) {
    return clientAPI(baseURL).get(`/packages/seo/${metaId}`)
  },
  // get City Details
  getCityDetails (slug) {
    return clientAPI(baseURL).get(`/tours/getcitydetails/${slug}`)
  },
  // get posts from blog wordpress
  getPostsBlog () {
    return wpClientAPI.get('/posts-api-wp')
  }
}
