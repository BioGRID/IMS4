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
export async function API_CURATION_GROUP_FETCH( ) {
    const user = store.getters['auth/getUser'];

    try {
        const res = await axios.get( process.env.VUE_APP_ACE_URL! + '/curationgroups?count=100000&activeonly=1', {
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

// Add a new curation group to the database
export async function API_CURATION_GROUP_ADD( payload: object ) {
    const user = store.getters['auth/getUser'];
    store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );

    try {
        const res = await axios.post( process.env.VUE_APP_ACE_URL! + '/curationgroup', payload, {
            headers: { Authorization: 'Bearer ' + user.access_key },
        });

        if (res.status !== 200) {
            console.error( res );
            console.log( 'Received ' + res.status + ' response code' );
        } else {
            store.dispatch( 'notify/displayNotification', notification( 'success', 'curationgroup_add_success' ), {root: true });
            return true;
        }

    } catch (error) {
        if ( error.response.status === 409 ) {
            store.dispatch( 'notify/displayNotification', notification( 'error', 'curationgroup_add_conflict' ), {root: true });
        } else {
            console.log(error);
            store.dispatch( 'notify/displayNotification', notification( 'error', 'curationgroup_add_unknown' ), {root: true });
        }
    } finally {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
    }

    return false;
}

// Update an existing curation group
export async function API_CURATION_GROUP_UPDATE( payload: object ) {
    const user = store.getters['auth/getUser'];
    store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );

    try {
        const res = await axios.put( process.env.VUE_APP_ACE_URL! + '/curationgroup', payload, {
            headers: { Authorization: 'Bearer ' + user.access_key },
        });

        if (res.status !== 200) {
            console.error( res );
            console.log( 'Received ' + res.status + ' response code' );
        } else {
            store.dispatch( 'notify/displayNotification', notification( 'success', 'curationgroup_update_success' ), {root: true });
            return true;
        }

    } catch (error) {
        if (error.response === undefined) {
            store.dispatch( 'notify/displayNotification', notification( 'error', 'curationgroup_update_unknown' ), {root: true });
            console.log( error.response.data );
        } else {
            if ( error.response.status === 409 ) {
                store.dispatch( 'notify/displayNotification', notification( 'error', 'curationgroup_update_conflict' ), {root: true });
            } else {
                console.log(error);
                store.dispatch( 'notify/displayNotification', notification( 'error', 'curationgroup_update_unknown' ), {root: true });
            }
        }
    } finally {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
    }

    return false;
}
