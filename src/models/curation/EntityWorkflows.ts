import axios from 'axios';
import store from '@/store/store';

export interface EntityWorkflowEntry {
    entity_workflow_id: number;
    name: string;
    entity_family_id: number;
    workflow: any;
    user_id: number;
    deprecated: number;
}

export interface EntityWorkflowHash {
    [key: number]: EntityWorkflowEntry;
}

// Get entity families from the Curation API
export async function API_ENTITY_WORKFLOW_FETCH( ) {
    const user = store.getters['auth/getUser'];

    try {
        const res = await axios.get( process.env.VUE_APP_ACE_URL! + '/entityworkflows?count=100000&activeonly=1', {
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
