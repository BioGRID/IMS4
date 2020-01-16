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

// Add a new User
export function API_USER_ADD( payload: object, successCallback?: () => void ) {
    const user = store.getters['auth/getUser'];
    store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
    return axios.post( process.env.VUE_APP_AUTH_URL! + '/user', payload, {
        headers: { Authorization: 'Bearer ' + user.access_key },
    })
    .then( (res) => {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        if ( res.status === 200 ) {
            store.dispatch( 'notify/displayNotification', {
                message: 'Successfully added new user',
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
                 message: 'User details conflict with an existing user (username or email). Please use alternatives.',
                 color: 'error',
             }, {root: true });
        } else {
            console.log(error);
            store.dispatch( 'notify/displayNotification', {
                message: 'Unable to add user.',
                color: 'error',
            }, {root: true });
        }
    });
}
