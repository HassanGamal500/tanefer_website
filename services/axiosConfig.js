import axios from 'axios'

const getAuthToken = () => localStorage.getItem('authToken')

const clientAPI = (url) => {
  return axios.create({
    baseURL: url,
    delayed: true, // use this custom option to allow overrides
    withCredentials: false,
    headers: {
      clientSecret: process.env.clientSecret,
      'content-type': 'application/json',
      ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {})
    }
  })
}

export default clientAPI
