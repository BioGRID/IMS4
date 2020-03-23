import axios from 'axios';
import store from '@/store/store';
import notification from '@/utils/Notifications';

export interface PermHash {
    [key: string]: PermRecord;
}

export interface PermRecord {
    id: number;
    name: string;
    description: string;
    category: string;
    level: string;
}

// Update an existing Permission
export async function API_PERMISSION_UPDATE( payload: object, permID: number ) {
    const user = store.getters['auth/getUser'];
    store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );

    try {
        const res = await axios.put( process.env.VUE_APP_AUTH_URL! + '/permission/' + permID, payload, {
            headers: { Authorization: 'Bearer ' + user.access_key },
        });

        if (res.status !== 200) {
            console.error( res );
            console.log( 'Received ' + res.status + ' response code' );
        } else {
            store.dispatch( 'notify/displayNotification', notification( 'success', 'permission_update_success' ), {root: true });
            return true;
        }

    } catch (error) {
        if (error.response === undefined) {
            store.dispatch( 'notify/displayNotification', notification( 'error', 'permission_update_unknown' ), {root: true });
            console.log( error );
        } else {
            if ( error.response.status === 409 ) {
                store.dispatch( 'notify/displayNotification', notification( 'error', 'permission_update_conflict' ), {root: true });
            } else {
                console.log(error);
                store.dispatch( 'notify/displayNotification', notification( 'error', 'permission_update_unknown' ), {root: true });
            }
        }
    } finally {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
    }

    return false;

}

// Add a new Permission
export async function API_PERMISSION_ADD( payload: object ) {
    const user = store.getters['auth/getUser'];
    store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );

    try {

        const res = await axios.post( process.env.VUE_APP_AUTH_URL! + '/permission', payload, {
            headers: { Authorization: 'Bearer ' + user.access_key },
        });

        if (res.status !== 200) {
            console.error( res );
            console.log( 'Received ' + res.status + ' response code' );
        } else {
            store.dispatch( 'notify/displayNotification', notification( 'success', 'permission_add_success' ), {root: true });
            return true;
        }
    } catch (error) {
        if (error.response === undefined) {
            store.dispatch( 'notify/displayNotification', notification( 'error', 'permission_add_unknown' ), {root: true });
            console.log( error );
        } else {
            if ( error.response.status === 409 ) {
                store.dispatch( 'notify/displayNotification', notification( 'error', 'permission_add_conflict' ), {root: true });
            } else {
                console.log(error);
                store.dispatch( 'notify/displayNotification', notification( 'error', 'permission_add_unknown' ), {root: true });
            }
        }
    } finally {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
    }

    return false;
}

// Get Permissions
export async function API_PERMISSION_GETALL( ) {
    const user = store.getters['auth/getUser'];

    try {
        const res = await axios.get( process.env.VUE_APP_AUTH_URL! + '/permissions', {
            headers: { Authorization: 'Bearer ' + user.access_key },
        });

        if (res.status !== 200) {
            console.error( res );
            console.log( 'Received ' + res.status + ' response code' );
        } else {
            return res.data.data;
        }

    } catch ( error ) {
        console.log( error );
        console.error( error.response );
        throw new Error(error.response.data.message);
    }

    return undefined;
}
