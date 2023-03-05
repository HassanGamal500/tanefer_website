import axios from 'axios'

const clientAPI = url =>
  axios.create({
    baseURL: url,
    withCredentials: false,
    headers: {
      clientSecret: process.env.clientSecret,
      'content-type': 'application/json'
    }
  })
export default clientAPI
