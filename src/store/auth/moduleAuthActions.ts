import axios from 'axios';
import router from '@/router';
import notification from '@/utils/Notifications';
import { PermHash, PermRecord, API_PERMISSION_GETALL } from '@/models/auth/Permission';
import { UserHash, User, API_USER_GETALL, API_USER_GETME, API_USER_LOGOUT, API_USER_LOGIN } from '@/models/auth/User';

const moduleAuthActions = {
    update_user: (context: any, payload: any) => {
        return context.commit( 'AUTH_UPDATE_USER', payload );
    },
    login: (context: any, payload: any) => {
        console.log(payload);
        return API_USER_LOGIN( payload.userDetails, (data: User) => {
            // Valid User, Set User Object
            context.dispatch( 'update_user', data ).then( () => {
                // Connect to websocket
                payload.vm.$connect( process.env.VUE_APP_ACE_WEBSOCKET + '?access_token=' + data.access_key + '&id=' + data.id );
                // Fetch list of users from the API for the store
                context.dispatch( 'fetch_users', {}, {} );
                // Fetch list of organisms from the API for the store
                context.dispatch( 'annotation/fetch_organisms', {}, {root: true} );
                // Fetch list of curation_groups from the API
                context.dispatch( 'curation/fetch_curation_groups', {}, {root: true} );
                // Get the list of permissions
                context.dispatch( 'fetch_permissions', {}, {} ).then( () => {
                    // Redirect to Dashboard
                    router.push( '/' );
                });
            });
        });
    },
    logout: (context: any, payload: any) => {
        // Logout and Reset State Variables
        return API_USER_LOGOUT( () => {
            context.commit( 'AUTH_UPDATE_USER', undefined );
            context.commit( 'AUTH_UPDATE_USERS', {} );
            context.commit( 'AUTH_UPDATE_PERMISSIONS', {} );
            payload.vm.$disconnect( );
        });
    },
    force_logout: (context: any, payload: any) => {
        // Force a person to logout when sent by the websocket server
        router.push( '/pages/login' );
    },
    fetch_users: (context: any, payload: any) => {
        return API_USER_GETALL( (data: User[]) => {
            const userHash: UserHash = {};
            for (const user of data) {
                userHash[String(user.id)] = user;
            }
            context.commit( 'AUTH_UPDATE_USERS', userHash );
        });
    },
    fetch_permissions: (context: any, payload: any) => {
        return API_PERMISSION_GETALL( (data: PermRecord[]) => {
            const permHash: PermHash = {};
            for (const permRecord of data) {
                permHash[permRecord.name] = permRecord;
            }
            context.commit( 'AUTH_UPDATE_PERMISSIONS', permHash );
        });
    },
    fetch_me: (context: any, payload: any) => {
        return API_USER_GETME( (data: User) => {
            console.log( 'FETCHED ME' );
            context.commit( 'AUTH_UPDATE_USER', data );
        });
    },
};

export default moduleAuthActions;
