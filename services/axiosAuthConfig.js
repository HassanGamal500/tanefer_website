import axios from 'axios'

let token = ''

if (typeof window !== 'undefined') {
  // This code will only run on the client side
  token = localStorage.getItem('authToken')
}

const clientAuthAPI = url =>
  axios.create({
    baseURL: url,
    delayed: true, // use this custom option to allow overrides
    withCredentials: false,
    headers: {
      Authorization: `Bearer ${token}`,
      clientSecret: process.env.clientSecret,
      'content-type': 'application/json'
    }
  })
export default clientAuthAPI
