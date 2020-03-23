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
export async function API_ORGANISM_FETCH( ) {
    const user = store.getters['auth/getUser'];

    try {
        const res = await axios.get( process.env.VUE_APP_ANNOTATION_URL! + '/organisms?count=10000', {
            headers: { Authorization: 'Bearer ' + user.access_key },
        });

        if (res.status !== 200) {
            console.error( res );
            console.log( 'Received ' + res.status + ' response code' );
        } else {
            return res.data.data;
        }

    } catch (error) {
        console.log(error);
        throw new Error(error.response.data.message);
    }

    return undefined;
}
