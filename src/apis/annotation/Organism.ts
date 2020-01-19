import axios from 'axios';
import store from '@/store/store';

export interface OrganismEntry {
    id: number;
    common_name: string;
    official_name: string;
    abbreviation: string;
    strain: string;
    deprecated: number;
}

export interface OrganismHash {
    [key: number]: OrganismEntry;
}

// Get Organisms from the Annotation API
export function API_ORGANISM_FETCH( successCallback?: (data: []) => void ): any {
    const user = store.getters['auth/getUser'];
    return axios.get( process.env.VUE_APP_ANNOTATION_URL! + '/organisms?count=10000', {
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
