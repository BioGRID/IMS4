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

// Get Chemical/s from the Annotation API
export function API_CHEMICAL_FETCH( chemicalQueryID: number, successCallback?: (data: []) => void ): any {
    console.log("In Fetch: " + chemicalQueryID);
    const user = store.getters['auth/getUser'];
    return axios.get( process.env.VUE_APP_ANNOTATION_URL! + '/chemical/' + chemicalQueryID, {
        headers: { Authorization: 'Bearer ' + user.access_key },
    })
    .then( (res) => {
        if ( res.status === 200 ) {
            if (successCallback !== undefined) {
                console.log("success with data: " + res.data);
                successCallback(res.data);
            }
        }
    })
    .catch( (error) => {
        console.log(error);
    });
}
