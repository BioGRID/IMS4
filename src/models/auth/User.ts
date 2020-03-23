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
export async function API_USER_UPDATE( payload: object, userID: number ) {
    const user = store.getters['auth/getUser'];
    store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );

    try {

        const res = await axios.put( process.env.VUE_APP_AUTH_URL! + '/user/' + userID, payload, {
            headers: { Authorization: 'Bearer ' + user.access_key },
        });

        if (res.status !== 200) {
            console.error( res );
            console.log( 'Received ' + res.status + ' response code' );
        } else {
            store.dispatch( 'notify/displayNotification', notification( 'success', 'user_update_success' ), {root: true });
            return true;
        }

    } catch (error) {
        if (error.response === undefined) {
            store.dispatch( 'notify/displayNotification', notification( 'error', 'user_update_unknown' ), {root: true });
            console.log( error );
        } else {
            if ( error.response.status === 409 ) {
                store.dispatch( 'notify/displayNotification', notification( 'error', 'user_update_conflict' ), {root: true });
            } else {
                console.log( error );
                console.log( error.response );
                store.dispatch( 'notify/displayNotification', notification( 'error', 'user_update_unknown' ), {root: true });
            }
        }
    } finally {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
    }

    return false;

}

// Add a new User
export async function API_USER_ADD( payload: object ) {
    const user = store.getters['auth/getUser'];
    store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );

    try {
        const res = await axios.post( process.env.VUE_APP_AUTH_URL! + '/user', payload, {
            headers: { Authorization: 'Bearer ' + user.access_key },
        });

        if (res.status !== 200) {
            console.error( res );
            console.log( 'Received ' + res.status + ' response code' );
        } else {
            store.dispatch( 'notify/displayNotification', notification( 'success', 'user_add_success' ), {root: true });
            return true;
        }

    } catch (error) {
        if (error.response === undefined) {
            store.dispatch( 'notify/displayNotification', notification( 'error', 'user_update_unknown' ), {root: true });
            console.log( error );
        } else {
            if ( error.response.status === 409 ) {
                store.dispatch( 'notify/displayNotification', notification( 'error', 'user_add_conflict' ), {root: true });
            } else {
                console.log( error );
                console.log( error.response );
                store.dispatch( 'notify/displayNotification', notification( 'error', 'user_add_unknown' ), {root: true });
            }
        }
    } finally {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
    }

    return false;
}

// Get Users
export async function API_USER_GETALL( ) {
    const user = store.getters['auth/getUser'];

    try {
        const res = await axios.get( process.env.VUE_APP_AUTH_URL! + '/users', {
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

// Get USER INFO
export async function API_USER_GETME( ) {
    const user = store.getters['auth/getUser'];

    try {
        const res = await axios.post( process.env.VUE_APP_AUTH_URL! + '/me', {}, {
            headers: { Authorization: 'Bearer ' + user.access_key },
        });

        if (res.status !== 200) {
            console.error( res );
            console.log( 'Received ' + res.status + ' response code' );
        } else {
            return res.data;
        }
    } catch (error) {
        console.log( error );
        console.log( error.response );
        throw new Error(error.response.data.message);
    }

    return undefined;

}

// Logout User
export async function API_USER_LOGOUT( ) {
    const user = store.getters['auth/getUser'];

    try {
        const res = await axios.post( process.env.VUE_APP_AUTH_URL! + '/logout', {}, {
            headers: { Authorization: 'Bearer ' + user.access_key },
        });

        if (res.status !== 200) {
            console.error( res );
            console.log( 'Received ' + res.status + ' response code' );
        } else {
            return true;
        }

    } catch (error) {
        console.log( error );
        console.log( error.response );
        if (error.response === undefined) {
            store.dispatch( 'notify/displayNotification', notification( 'error', 'user_logout_inaccessible' ), {root: true });
            console.log( error );
        } else {
            if ( error.response.status === 401 ) {
                store.dispatch( 'notify/displayNotification', notification( 'error', 'user_logout_unauthorized' ), {root: true });
            } else if ( error.response.status === 500 ) {
                store.dispatch( 'notify/displayNotification', notification( 'error', 'user_logout_inaccessible' ), {root: true });
            } else if ( error.response.status === 404 ) {
                store.dispatch( 'notify/displayNotification', notification( 'error', 'user_logout_inaccessible' ), {root: true });
            }
        }
    }

    return false;
}

// Add a new User
export async function API_USER_LOGIN( payload: object ) {
    store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );

    try {
        const res = await axios.post( process.env.VUE_APP_AUTH_URL! + '/login', payload, {} );
        if (res.status !== 200) {
            console.error( res );
            console.log( 'Received ' + res.status + ' response code' );
        } else {
            return res.data;
        }
    } catch ( error ) {
        console.log(error);
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        if (error.response === undefined) {
            store.dispatch( 'notify/displayNotification', notification( 'error', 'login_error_serverdown' ), {root: true });
            console.log( error );
        } else {
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
            } else {
                store.dispatch( 'notify/displayNotification', notification( 'error', 'login_error_serverdown' ), {root: true });
                console.log( error.response.data );
            }
        }
    }

    return undefined;

}
