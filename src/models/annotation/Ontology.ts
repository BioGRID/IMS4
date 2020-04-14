import axios from 'axios';
import store from '@/store/store';
import notification from '@/utils/Notifications';

export interface OntologyHash {
    [key: string]: OntologyRecord;
}

export interface OntologyRecord {
    ontology_id: number;
    name: string;
    abbreviation: string;
    prefix: string;
    url: string;
    deprecated: number;
}

// Get Ontologies
export async function API_ONTOLOGY_GETALL( successCallback?: (data: []) => void ): Promise<any> {
    const user = store.getters['auth/getUser'];
    return axios.get( process.env.VUE_APP_ANNOTATION_URL! + '/ontologies?count=10000', {
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
        throw new Error(error.response.data.message);
    });
}
