import axios from 'axios';
import store from '@/store/store';
import notification from '@/utils/Notifications';

export interface UserHash {
    [key: string]: User;
}

export interface User {
    id: number;
    name: string;
    password?: string;
    first_name: string;
    last_name: string;
    email: string;
    class: string;
    status?: string;
    password_reset: number;
    access_key?: string;
}

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
            store.dispatch( 'notify/displayNotification', notification( 'success', 'user_update_success' ), {root: true }).then( () => {
                if (successCallback !== undefined) {
                    successCallback();
                }
            });
        }
    })
    .catch( (error) => {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        if ( error.response.status === 409 ) {
            store.dispatch( 'notify/displayNotification', notification( 'error', 'user_update_conflict' ), {root: true });
        } else {
            console.log( error );
            console.log( error.response );
            store.dispatch( 'notify/displayNotification', notification( 'error', 'user_update_unknown' ), {root: true });
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
            store.dispatch( 'notify/displayNotification', notification( 'success', 'user_add_success' ), {root: true }).then( () => {
                if (successCallback !== undefined) {
                    successCallback();
                }
            });
        }
    })
    .catch( (error) => {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        if ( error.response.status === 409 ) {
            store.dispatch( 'notify/displayNotification', notification( 'error', 'user_add_conflict' ), {root: true });
        } else {
            console.log( error );
            console.log( error.response );
            store.dispatch( 'notify/displayNotification', notification( 'error', 'user_add_unknown' ), {root: true });
        }
    });
}

// Get Users
export async function API_USER_GETALL( successCallback?: (data: User[]) => void ): Promise<any> {
    const user = store.getters['auth/getUser'];
    return axios.get( process.env.VUE_APP_AUTH_URL! + '/users', {
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
        console.log( error );
        console.log( error.response );
        throw new Error(error.response.data.message);
    });
}

// Get USER INFO
export function API_USER_GETME( successCallback?: (data: User) => void ): any {
    const user = store.getters['auth/getUser'];
    return axios.post( process.env.VUE_APP_AUTH_URL! + '/me', {}, {
        headers: { Authorization: 'Bearer ' + user.access_key },
    })
    .then( (res) => {
        if ( res.status === 200 ) {
            if (successCallback !== undefined) {
                console.log(res.data);
                successCallback(res.data);
            }
        }
    })
    .catch( (error) => {
        console.log( error );
        console.log( error.response );
        throw new Error(error.response.data.message);
    });
}

// Logout User
export function API_USER_LOGOUT( successCallback?: () => void ): any {
    const user = store.getters['auth/getUser'];
    return axios.post( process.env.VUE_APP_AUTH_URL! + '/logout', {}, {
        headers: { Authorization: 'Bearer ' + user.access_key },
    })
    .then( (res) => {
        if ( res.status === 200 ) {
            if (successCallback !== undefined) {
                successCallback();
            }
        }
    })
    .catch( (error) => {
        console.log( error );
        console.log( error.response );
        if ( error.response.status === 401 ) {
            store.dispatch( 'notify/displayNotification', notification( 'error', 'user_logout_unauthorized' ), {root: true });
        } else if ( error.response.status === 500 ) {
            store.dispatch( 'notify/displayNotification', notification( 'error', 'user_logout_inaccessible' ), {root: true });
        }
    });
}

// Add a new User
export function API_USER_LOGIN( payload: object, successCallback?: (data: User) => void ) {
    store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
    return axios.post( process.env.VUE_APP_AUTH_URL! + '/login', payload, {} )
    .then( (res) => {
        if ( res.status === 200 ) {
            if (successCallback !== undefined) {
                successCallback(res.data);
            }
        }
    })
    .catch( (error) => {
        console.log(error);
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        if ( error.response.status === 404 ) {
            // Unrecognized User Name
            store.dispatch( 'notify/displayNotification', notification( 'error', 'login_error_notfound' ), {root: true });
        } else if ( error.response.status === 401 ) {
            // Unauthorized User, return False
            store.dispatch( 'notify/displayNotification', notification( 'error', 'login_error_unauthorized' ), {root: true });
        } else if ( error.response.status === 400 ) {
            // Bad Request, Show message passed
            store.dispatch( 'notify/displayNotification', {
                message: error.response.data.message,
                color: 'error',
            }, {root: true });
            console.log( error.response.data );
        } else if ( error.response.status === 500 ) {
            store.dispatch( 'notify/displayNotification', notification( 'error', 'login_error_serverdown' ), {root: true });
            console.log( error.response.data );
        }
    });
}
