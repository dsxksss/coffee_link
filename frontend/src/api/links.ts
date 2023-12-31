import axios from './base';

const BASE_URL = '/links'

const linksAPI = {
    getAllCoffeeLinks: () => {
        return axios.get(BASE_URL);
    },
    
    getMemberHiddenCoffeeLinks: () => {
        return axios.get(`${BASE_URL}/memberHiddenLinks`, {
            headers: {
                'X-Auth-Token': localStorage.getItem('authToken')
            }
        });
    },

    createLink: (linkURL: string, linkTitle: string, linkDescription: string, hidden: boolean) => {
        const data = new FormData();
        data.append('linkURL', linkURL);
        data.append('linkTitle', linkTitle);
        data.append('linkDescription', linkDescription);
        data.append('hidden', String(hidden));
        return axios.post(BASE_URL, data, {
            headers: {
                'X-Auth-Token': localStorage.getItem('authToken')
            }
        });
    },

    updateLink: (linkID: string, newLinkURL: string, newLinkTitle: string, newLinkDescription: string, newHidden: boolean) => {
        const data = new FormData();
        data.append('linkID', linkID);
        data.append('newLinkURL', newLinkURL);
        data.append('newLinkTitle', newLinkTitle);
        data.append('newLinkDescription', newLinkDescription);
        data.append('newHidden', String(newHidden));
        return axios.put(BASE_URL, data, {
            headers: {
                'X-Auth-Token': localStorage.getItem('authToken')
            }
        });
    },

    deleteLink: (linkID: string) => {
        const data = new FormData();
        data.append('linkID', linkID);
        return axios.request({
            method: 'delete',
            url: 'http://localhost:3001/links',
            headers: {
                'X-Auth-Token': localStorage.getItem('authToken')
            },
            data: data
        });
    }
}

export default linksAPI;