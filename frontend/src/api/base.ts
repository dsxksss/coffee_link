import { Axios } from 'axios';

const axios = new Axios({
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    timeout: 3000,
    baseURL: 'http://localhost:3001'
})

export default axios;