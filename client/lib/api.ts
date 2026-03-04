import axios from 'axios';

const apiClient= axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5050/api',
    headers: {
        'Content-Type': 'application/json'
    }
})
export default apiClient;