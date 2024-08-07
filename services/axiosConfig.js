import axios from 'axios'

const clientAPI = url =>
  axios.create({
    baseURL: url,
    delayed: true, // use this custom option to allow overrides
    withCredentials: false,
    headers: {
      clientSecret: process.env.clientSecret,
      'content-type': 'application/json'
    }
  })
export default clientAPI
