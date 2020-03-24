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

// Add History entry
export async function API_HISTORY_ADD( payload: HistoryEntry ) {
    const user = store.getters['auth/getUser'];

    try {
        const res = await axios.post( process.env.VUE_APP_ACE_URL! + '/history', payload, {
            headers: { Authorization: 'Bearer ' + user.access_key },
        });

        if (res.status !== 200) {
            console.error( res );
            console.log( 'Received ' + res.status + ' response code' );
        } else {
            return true;
        }

    } catch (error) {
        if (error.response === undefined) {
            store.dispatch( 'notify/displayNotification', notification( 'error', 'history_add_unknown' ), {root: true });
            console.log( error );
        } else {
            if ( error.response.status === 500 ) {
                store.dispatch( 'notify/displayNotification', notification( 'error', 'history_add_improper' ), {root: true });
            } else {
                console.log( error );
                console.log( error.response );
                store.dispatch( 'notify/displayNotification', notification( 'error', 'history_add_unknown' ), {root: true });
            }
        }
    }

    return false;
}
