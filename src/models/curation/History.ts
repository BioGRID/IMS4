import axios from 'axios';
import store from '@/store/store';
import notification from '@/utils/Notifications';

export interface HistoryEntry {
    history_id: number;
    method: string;
    reference_id: number;
    reference_type: string;
    curation_group_id: number;
    comment: string;
    state: string;
    user_id: number;
    added_date: string;
}

// Get Histories from the Curation API
export async function API_HISTORY_FETCH( refID: number, refType: string ) {
    const user = store.getters['auth/getUser'];

    try {
        const res = await axios.get( process.env.VUE_APP_ACE_URL! + '/histories/' + refType + '/' + refID + '?count=100000', {
            headers: { Authorization: 'Bearer ' + user.access_key },
        });

        if (res.status !== 200) {
            console.error( res );
            console.log( 'Received ' + res.status + ' response code' );
        } else {
            return res.data.data;
        }

    } catch (error) {
        console.log( error );
        console.error( error.response );
        throw new Error(error.response.data.message);
    }

    return undefined;
}
