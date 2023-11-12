import axios  from './base';

const BASE_URL = '/members'

const membersAPI = {
    login: (memberName: string, password: string) => {
        const data = new FormData();
        data.append('memberName', memberName);
        data.append('password', password);
        return axios.post(BASE_URL, data);
    },

    register: (memberName: string, password: string) => {
        const data = new FormData();
        data.append('memberName', memberName);
        data.append('password', password);
        return axios.post(`${BASE_URL}/register`, data);
    },

    // TODO: update member information function
}

export default membersAPI;