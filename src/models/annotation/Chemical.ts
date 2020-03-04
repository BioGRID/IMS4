import axios from 'axios';
import store from '@/store/store';

export interface ChemicalEntry {
    chemical_id: number;
    name: string;
    description: string;
    chemical_type: string;
    source: string;
    source_id: string;
    synonyms: string;
    formula: string;
    inchi: string;
    inchikey: string;
    smile: string;
    molecular_weight: string;
    dbxrefs: object[];
    deprecated: number;
}

export interface ChemicalSynonymMap {
    [synonymID: string]: string;
}

// Get Chemical/s from the Annotation API
export function API_CHEMICAL_FETCH( chemicalQueryID: string, successCallback?: (data: []) => void ): any {
    const user = store.getters['auth/getUser'];
    return axios.get( process.env.VUE_APP_ANNOTATION_URL! + '/chemical/' + chemicalQueryID, {
        headers: { Authorization: 'Bearer ' + user.access_key },
    })
    .then( (res) => {
        if ( res.status === 200 ) {
            if (successCallback !== undefined) {
                successCallback(res.data);
            }
        }
    })
    .catch( (error) => {
        console.log(error);
    });
}

// Get All Chemical/s from the Annotation API
export function API_CHEMICAL_FETCH_ALL( successCallback?: (data: []) => void ): any {
    const user = store.getters['auth/getUser'];
    return axios.get( process.env.VUE_APP_ANNOTATION_URL! + '/chemicals', {
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
