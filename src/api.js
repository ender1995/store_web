import axios from 'axios'

const token = localStorage.getItem('access_token')

const api = axios.create({
    baseURL: '/api',
    headers: {Authorization: `Bearer ${token}`}
})

export default api