import router from '@/router';
import { PermHash, PermRecord, API_PERMISSION_GETALL } from '@/models/auth/Permission';
import { UserHash, User, API_USER_GETALL, API_USER_GETME, API_USER_LOGOUT, API_USER_LOGIN } from '@/models/auth/User';
import notification from '@/utils/Notifications';

const moduleAuthActions = {
    update_user: (context: any, payload: any) => {
        return context.commit( 'AUTH_UPDATE_USER', payload );
    },
    login: async (context: any, payload: any) => {
        const data: User | undefined = await API_USER_LOGIN( payload.userDetails );
        if (data !== undefined) {
            // Valid User, Set User Object
            context.dispatch( 'update_user', data ).then( () => {
                // Connect to websocket
                payload.vm.$connect( process.env.VUE_APP_ACE_WEBSOCKET + '?access_token=' + data.access_key + '&id=' + data.id );
                // Fetch list of users from the API for the store
                const userPromise = context.dispatch( 'fetch_users', {}, {} );
                // Fetch list of organisms from the API for the store
                const orgPromise = context.dispatch( 'annotation/fetch_organisms', {}, {root: true} );
                // Fetch list of curation_groups from the API
                const groupPromise = context.dispatch( 'curation/fetch_curation_groups', {}, {root: true} );
                // Fetch list of attribute types from the API
                const attributePromise = context.dispatch( 'curation/fetch_attribute_types', {}, {root: true} );
                // Get the list of permissions
                const permissionPromise = context.dispatch( 'fetch_permissions', {}, {} );
                // Get latest 60 processing tasks
                const processingPromise = context.dispatch( 'curation/fetch_processing_tasks', {}, {root: true} );

                Promise.all([
                    userPromise,
                    orgPromise,
                    groupPromise,
                    attributePromise,
                    permissionPromise,
                    processingPromise,
                ]).then( () => {
                    // Redirect to Dashboard
                    router.push( '/' );
                }).catch( (error) => {
                    console.error( error );
                    context.dispatch( 'notify/displayNotification', notification( 'error', 'login_error_apisdown' ), {root: true });
                }).finally( () => {
                    context.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
                });

            });
        }
    },
    logout: async (context: any, payload: any) => {
        // Logout and Reset State Variables
        const status = await API_USER_LOGOUT( );
        if (status) {
            context.commit( 'AUTH_UPDATE_USER', undefined );
            context.commit( 'AUTH_UPDATE_USERS', {} );
            context.commit( 'AUTH_UPDATE_PERMISSIONS', {} );
            context.dispatch( 'curation/truncate_datasets', {}, {root: true} );
            payload.vm.$disconnect( );
        }
    },
    force_logout: (context: any, payload: any) => {
        // Force a person to logout when sent by the websocket server
        router.push( '/pages/login' );
    },
    fetch_users: async (context: any, payload: any) => {
        const data: User[] = await API_USER_GETALL();
        if (data !== undefined) {
            const userHash: UserHash = {};
            for (const user of data) {
                userHash[String(user.id)] = user;
            }
            context.commit( 'AUTH_UPDATE_USERS', userHash );
        } else {
            throw new Error( 'Unable to fetch list of users from auth api' );
        }
    },
    fetch_permissions: async (context: any, payload: any) => {
        const data: PermRecord[] = await API_PERMISSION_GETALL();
        if (data !== undefined) {
            const permHash: PermHash = {};
            for (const permRecord of data) {
                permHash[permRecord.name] = permRecord;
            }
            context.commit( 'AUTH_UPDATE_PERMISSIONS', permHash );
        } else {
            throw new Error( 'Unable to fetch list of permissions from auth api' );
        }
    },
    fetch_me: async (context: any, payload: any) => {
        const data: User = await API_USER_GETME( );
        if (data !== undefined) {
            context.commit( 'AUTH_UPDATE_USER', data );
        } else {
            throw new Error( 'Unable to fetch ME from auth api' );
        }
    },
};

export default moduleAuthActions;
