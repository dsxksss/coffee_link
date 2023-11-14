import axios from './base';

const BASE_URL = '/favorites'

const favoritesAPI = {
    getMemberFavorites: () => {
        return axios.get(BASE_URL, {
            headers: {
                'X-Auth-Token': localStorage.getItem('authToken')
            }
        });
    },

    addFavorite: (linkID: string) => {
        const data = new FormData();
        data.append('linkID', linkID);
        return axios.post(BASE_URL, data, {
            headers: {
                'X-Auth-Token': localStorage.getItem('authToken')
            }
        });
    },

    deleteFavorite: (linkID: string) => {
        const data = new FormData();
        data.append('linkID', linkID);
        return axios.request({
            method: 'delete',
            url: 'http://localhost:3001/favorites',
            headers: {
                'X-Auth-Token': localStorage.getItem('authToken')
            },
            data: data
        });
    },
}

export default favoritesAPI;