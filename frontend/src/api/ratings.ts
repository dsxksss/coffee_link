import axios from './base';

const BASE_URL = '/ratings'

const ratingsAPI = {
    linkRating: (linkID: string, ratingScore:number) => {
        const data = new FormData();
        data.append('linkID', linkID);
        data.append('ratingScore', ratingScore.toString());
        return axios.post(BASE_URL, data,{
            headers: {
                'X-Auth-Token': localStorage.getItem('authToken')
            }
        });
    },
}

export default ratingsAPI;