import clientAPI from './axiosConfig'

const baseURL = 'https://be.tanefer.com/api/v2'
export default {
  // get city adventures
  getCityAdventures (cityId, puplish) {
    return clientAPI(baseURL).get(`/packages/activities/search?city_id=${cityId}&for_package=${puplish}`)
  },

  // calculate adventure total price
  calculateAdventurePrice (payload) {
    return clientAPI(baseURL).post('/packages/activities/calculate-total-price', payload)
  },

  // book adventure
  bookAdventure (payload) {
    return clientAPI(baseURL).post('/packages/activities/book', payload)
  }
}
