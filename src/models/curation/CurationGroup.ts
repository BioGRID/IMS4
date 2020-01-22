import axios from 'axios';
import store from '@/store/store';
import notification from '@/utils/Notifications';

export interface CurationGroupEntry {
    curation_group_id: number;
    name: string;
    description: string;
    organisms: number[];
    users: number[];
    deprecated: number;
}

export interface CurationGroupHash {
    [key: number]: CurationGroupEntry;
}

// Get Curation Groups from the Curation API
export function API_CURATION_GROUP_FETCH( successCallback?: (data: []) => void ): any {
    const user = store.getters['auth/getUser'];
    return axios.get( process.env.VUE_APP_ACE_URL! + '/curationgroups?count=100000&activeonly=1', {
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

// Add a new curation group to the database
export function API_CURATION_GROUP_ADD( payload: object, successCallback?: () => void ): any {
    const user = store.getters['auth/getUser'];
    store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
    return axios.post( process.env.VUE_APP_ACE_URL! + '/curationgroup', payload, {
        headers: { Authorization: 'Bearer ' + user.access_key },
    })
    .then( (res) => {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        if ( res.status === 200 ) {
            store.dispatch( 'notify/displayNotification', notification( 'success', 'curationgroup_add_success' ), {root: true }).then( () => {
                if (successCallback !== undefined) {
                    successCallback();
                }
            });
        }
    })
    .catch( (error) => {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        if ( error.response.status === 409 ) {
            store.dispatch( 'notify/displayNotification', notification( 'error', 'curationgroup_add_conflict' ), {root: true });
        } else {
            console.log(error);
            store.dispatch( 'notify/displayNotification', notification( 'error', 'curationgroup_add_unknown' ), {root: true });
        }
    });
}

// Update an existing curation group
export function API_CURATION_GROUP_UPDATE( payload: object, successCallback?: () => void ) {
    const user = store.getters['auth/getUser'];
    store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
    return axios.put( process.env.VUE_APP_ACE_URL! + '/curationgroup', payload, {
        headers: { Authorization: 'Bearer ' + user.access_key },
    })
    .then( (res) => {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        if ( res.status === 200 ) {
            store.dispatch( 'notify/displayNotification', notification( 'success', 'curationgroup_update_success' ), {root: true }).then( () => {
                if (successCallback !== undefined) {
                    successCallback();
                }
            });
        }
    })
    .catch( (error) => {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        if ( error.response.status === 409 ) {
            store.dispatch( 'notify/displayNotification', notification( 'error', 'curationgroup_update_conflict' ), {root: true });
        } else {
            console.log(error);
            store.dispatch( 'notify/displayNotification', notification( 'error', 'curationgroup_update_unknown' ), {root: true });
        }
    });
}
