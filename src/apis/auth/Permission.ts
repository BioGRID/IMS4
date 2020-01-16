import axios from 'axios';
import store from '@/store/store';

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
            store.dispatch( 'notify/displayNotification', {
                message: 'Successfully updated permission details',
                color: 'success',
            }, {root: true }).then( () => {
                if (successCallback !== undefined) {
                    successCallback();
                }
            });
        }
    })
    .catch( (error) => {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        if ( error.response.status === 409 ) {
            store.dispatch( 'notify/displayNotification', {
                 message: 'Updated permission details conflict with an existing permission. Unable to update.',
                 color: 'error',
             }, {root: true });
        } else {
            console.log(error);
            store.dispatch( 'notify/displayNotification', {
                message: 'Unable to update permission information',
                color: 'error',
            }, {root: true });
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
            store.dispatch( 'notify/displayNotification', {
                message: 'Successfully added new permission',
                color: 'success',
            }, {root: true }).then( () => {
                if (successCallback !== undefined) {
                    successCallback();
                }
            });
        }
    })
    .catch( (error) => {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        if ( error.response.status === 409 ) {
            store.dispatch( 'notify/displayNotification', {
                 message: 'Permission with this name already exists.',
                 color: 'error',
             }, {root: true });
        } else {
            console.log(error);
            store.dispatch( 'notify/displayNotification', {
                message: 'Unable to Add Permission',
                color: 'error',
            }, {root: true });
        }
    });
}
