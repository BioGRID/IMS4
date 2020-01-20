import axios from 'axios';
import store from '@/store/store';

export interface CurationGroupEntry {
    curation_group_id: number;
    name: string;
    description: string;
    organisms: number[];
    users: number[];
    deprecated: number;
}

export interface CurationGroupHash {
    [key: number]: CurationGroupEntry;
}

// Get Curation Groups from the Curation API
export function API_CURATION_GROUP_FETCH( successCallback?: (data: []) => void ): any {
    const user = store.getters['auth/getUser'];
    return axios.get( process.env.VUE_APP_ACE_URL! + '/curationgroups?count=100000', {
        headers: { Authorization: 'Bearer ' + user.access_key },
    })
    .then( (res) => {
        if ( res.status === 200 ) {
            if (successCallback !== undefined) {
                successCallback(res.data.data);
            }
        }
    })
    .catch( (error) => {
        console.log(error);
    });
}
