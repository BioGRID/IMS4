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
export function API_HISTORY_FETCH( refID: number, refType: string, successCallback?: (data: []) => void ): any {
    const user = store.getters['auth/getUser'];
    return axios.get( process.env.VUE_APP_ACE_URL! + '/histories/' + refType + '/' + refID + '?count=100000', {
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
