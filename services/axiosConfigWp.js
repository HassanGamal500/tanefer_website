import axios from 'axios'

const wpClientAPI = axios.create({
  baseURL: 'https://tanefer.com/blog',
  delayed: true, // use this custom option to allow overrides
  withCredentials: false,
  headers: {
    'X-API-Key': process.env.wpClientSecret,
    'content-type': 'application/json'
  }
})
export default wpClientAPI
