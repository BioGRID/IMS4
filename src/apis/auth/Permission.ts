import axios from 'axios';
import store from '@/store/store';

// Update an existing User
export function API_USER_UPDATE( payload: object, userID: number, successCallback?: () => void ) {
    const user = store.getters['auth/getUser'];
    store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
    return axios.put( process.env.VUE_APP_AUTH_URL! + '/user/' + userID, payload, {
        headers: { Authorization: 'Bearer ' + user.access_key },
    })
    .then( (res) => {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        if ( res.status === 200 ) {
            store.dispatch( 'notify/displayNotification', {
                message: 'Successfully updated user information',
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
                 message: 'User information conflicts with an existing user (same name or email). Unable to update.',
                 color: 'error',
             }, {root: true });
        } else {
            console.log(error);
            store.dispatch( 'notify/displayNotification', {
                message: 'Unable to update user information',
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
