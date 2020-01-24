import axios from 'axios';
import store from '@/store/store';
import notification from '@/utils/Notifications';

// Update an existing Permission
export function API_PERMISSION_UPDATE( payload: object, permID: number, successCallback?: () => void ) {
    const user = store.getters['auth/getUser'];
    store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
    return axios.put( process.env.VUE_APP_AUTH_URL! + '/permission/' + permID, payload, {
        headers: { Authorization: 'Bearer ' + user.access_key },
    })
    .then( (res) => {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        if ( res.status === 200 ) {
            store.dispatch( 'notify/displayNotification', notification( 'success', 'permission_update_success' ), {root: true }).then( () => {
                if (successCallback !== undefined) {
                    successCallback();
                }
            });
        }
    })
    .catch( (error) => {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        if ( error.response.status === 409 ) {
            store.dispatch( 'notify/displayNotification', notification( 'error', 'permission_update_conflict' ), {root: true });
        } else {
            console.log(error);
            store.dispatch( 'notify/displayNotification', notification( 'error', 'permission_update_unknown' ), {root: true });
        }
    });
}

// Add a new Permission
export function API_PERMISSION_ADD( payload: object, successCallback?: () => void ) {
    const user = store.getters['auth/getUser'];
    store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
    return axios.post( process.env.VUE_APP_AUTH_URL! + '/permission', payload, {
        headers: { Authorization: 'Bearer ' + user.access_key },
    })
    .then( (res) => {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        if ( res.status === 200 ) {
            store.dispatch( 'notify/displayNotification', notification( 'success', 'permission_add_success' ), {root: true }).then( () => {
                if (successCallback !== undefined) {
                    successCallback();
                }
            });
        }
    })
    .catch( (error) => {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        if ( error.response.status === 409 ) {
            store.dispatch( 'notify/displayNotification', notification( 'error', 'permission_add_conflict' ), {root: true });
        } else {
            console.log(error);
            store.dispatch( 'notify/displayNotification', notification( 'error', 'permission_add_unknown' ), {root: true });
        }
    });
}
