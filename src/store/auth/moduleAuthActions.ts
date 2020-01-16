import axios from 'axios';
import router from '@/router';

const moduleAuthActions = {
    update_user: (context: any, payload: any) => {
        return context.commit( 'AUTH_UPDATE_USER', payload );
    },
    login: (context: any, payload: any) => {
        context.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        axios
            .post(
                process.env.VUE_APP_AUTH_URL! + '/login',
                payload.userDetails,
            )
            .then( (res) => {
                context.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
                if ( res.status === 200 ) {
                    // Valid User, Set User Object
                    context.dispatch( 'update_user', res.data ).then( () => {
                        // Fetch list of users from the API for the store
                        context.dispatch( 'fetch_users', {}, {} );
                        // Connect to websocket
                        payload.vm.$connect( process.env.VUE_APP_ACE_WEBSOCKET + '?access_token=' + res.data.access_key + '&id=' + res.data.id );
                        // Get the list of permissions
                        context.dispatch( 'fetch_permissions', {}, {} ).then( () => {
                            // Redirect to Dashboard
                            router.push( '/' );
                        });
                    });
                }
            })
            .catch( (error) => {
                context.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
                if ( error.response.status === 404 ) {
                    // Unrecognized User Name
                    context.dispatch( 'notify/displayNotification', {
                        message: 'Unrecognized username',
                        color: 'error',
                    }, {root: true });
                } else if ( error.response.status === 401 ) {
                    // Unauthorized User, return False
                    context.dispatch( 'notify/displayNotification', {
                        message: 'Unrecognized username/password combination',
                        color: 'error',
                    }, {root: true });
                } else if ( error.response.status === 400 ) {
                    // Bad Request, Show message passed
                    context.dispatch( 'notify/displayNotification', {
                        message: error.response.data.message,
                        color: 'error',
                    }, {root: true });
                    console.log( error.response.data );
                } else if ( error.response.status === 500 ) {
                    context.dispatch( 'notify/displayNotification', {
                        message: 'Authentication server is not accessible',
                        color: 'error',
                    }, {root: true });
                    console.log( error.response.data );
                }
            });
    },
    logout: (context: any, payload: any) => {
        // Reset State Variables
        context.commit( 'AUTH_UPDATE_USER', undefined );
        context.commit( 'AUTH_UPDATE_USERS', {} );
        context.commit( 'AUTH_UPDATE_PERMISSIONS', {} );
        payload.vm.$disconnect( );
        axios
            .post(
                process.env.VUE_APP_AUTH_URL! + '/logout', {}, {
                    headers: {
                        Authorization: 'Bearer ' + payload.user.access_key,
                    },
                })
            .catch( (error) => {
                if ( error.response.status === 401 ) {
                    // Unable to logout user
                    console.log( 'Unauthorized Logout Attempt' );
                } else if ( error.response.status === 500 ) {
                    console.log( 'Authentication server is not accessible' );
                } else {
                    console.log( error.response.data );
                }
            });
    },
    force_logout: (context: any, payload: any) => {
        // Force a person to logout when sent by the websocket server
        router.push( '/pages/login' );
    },
    fetch_users: (context: any, payload: any) => {
        return axios
            .get(
                process.env.VUE_APP_AUTH_URL! + '/users', {
                    headers: {
                        Authorization: 'Bearer ' + context.state.user.access_key,
                    },
                })
            .then( (res) => {
                if ( res.status === 200 ) {
                    // Fetch list of users from the API for the store
                    interface UserHash {
                        [key: string]: object;
                    }
                    const userHash: UserHash = {};
                    for (const user of res.data.data) {
                        userHash[String(user.id)] = user;
                    }
                    context.commit( 'AUTH_UPDATE_USERS', userHash );
                }
            })
            .catch( (error) => {
                console.log( error.response.data );
            });
    },
    fetch_permissions: (context: any, payload: any) => {
        return axios
            .get(
                process.env.VUE_APP_AUTH_URL! + '/permissions', {
                    headers: {
                        Authorization: 'Bearer ' + context.state.user.access_key,
                    },
                })
            .then( (res) => {
                if ( res.status === 200 ) {
                    // Fetch list of permissions from the API for the store
                    interface PermissionHash {
                        [key: string]: string;
                    }
                    const permissionHash: PermissionHash = {};
                    for (const permission of res.data.data) {
                        permissionHash[permission.name] = permission;
                    }
                    context.commit( 'AUTH_UPDATE_PERMISSIONS', permissionHash );
                }
            })
            .catch( (error) => {
                console.log( error.response.data );
            });
    },
    fetch_me: (context: any, payload: any) => {
        console.log(context.state.user.access_key);
        return axios
            .post(
                process.env.VUE_APP_AUTH_URL! + '/me', {}, {
                    headers: {
                        Authorization: 'Bearer ' + context.state.user.access_key,
                    },
                })
            .then( (res) => {
                if ( res.status === 200 ) {
                    context.commit( 'AUTH_UPDATE_USER', res.data );
                }
            })
            .catch( (error) => {
                console.log( error.response.data );
            });
    },
};

export default moduleAuthActions;
