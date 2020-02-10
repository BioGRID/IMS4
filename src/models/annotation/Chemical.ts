import axios from 'axios';
import store from '@/store/store';

export interface ChemicalEntry {
    id: number;
    common_name: string;
    official_name: string;
    abbreviation: string;
    strain: string;
    deprecated: number;
}

export interface ChemicalHash {
    [key: number]: ChemicalEntry;
}

// Get Chemical/s from the Annotation API
export function API_CHEMICAL_FETCH( chemicalID: number, successCallback?: (data: []) => void ): any {
    const user = store.getters['auth/getUser'];
    return axios.get( process.env.VUE_APP_ANNOTATION_URL! + '/chemical/' + chemicalID, {
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
