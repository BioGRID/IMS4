import axios from 'axios';
import router from '@/router';

const moduleAuthActions = {
    login: (context: any, payload: any) => {
        context.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        axios
            .post(
                process.env.VUE_APP_AUTH_URL! + '/login',
                payload.userDetails,
            )
            .then( (response) => {
                context.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
                if ( response.status === 200 ) {
                    // Valid User, Set User Object
                    context.commit( 'AUTH_UPDATE_USER', response.data );
                    router.push( '/' );
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
        context.commit( 'AUTH_UPDATE_USER', undefined );
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
};

export default moduleAuthActions;
