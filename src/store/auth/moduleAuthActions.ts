import axios from 'axios';
import router from '@/router';

const moduleAuthActions = {
    login: (context: any, payload: any) => {
        console.log(payload);
        payload.notify = true;
        context.dispatch( 'notify/displayNotification', {
            message: 'LOGIN SUCCESSFUL!',
            color: 'success',
        }, {root: true });
        /* axios
            .post(
                process.env.VUE_APP_AUTH_URL! + "/login",
                payload.userDetails,
            )
            .then( response => {
                if( response.status == 200 ) {
                    // Valid User, Set User Object
                    context.commit( 'AUTH_UPDATE_USER', response.data );
                } else if( response.status == 401 ) {
                    // Unauthorized User, return False
                }
            })
            .catch( error => console.log(error) ); */
    },
    logout: (context: any) => {
        context.commit( 'AUTH_UPDATE_USER', {} );
        router.push( '/login' );
    },
};

export default moduleAuthActions;
