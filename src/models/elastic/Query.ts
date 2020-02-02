import axios from 'axios';
import store from '@/store/store';

// Add a new User
export function ELASTIC_QUERY( search: object, index: string, displayLoading: boolean, successCallback?: (data: any) => void ) {
    const user = store.getters['auth/getUser'];
    if (displayLoading) {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
    }

    return axios.post( process.env.VUE_APP_SEARCH_URL! + '/query/' + index, search, {
        headers: { Authorization: 'Bearer ' + user.access_key },
    })
    .then( (res) => {
        if ( res.status === 200 ) {
            if (successCallback !== undefined) {
                successCallback(res.data);
            }
        }
    })
    .catch( (error) => {
        if ( error.response.status === 400 ) {
            // Query was improperly formatted
            console.log( 'Improperly formatted elastic search query' );
        } else if ( error.response.status === 500 ) {
            // Search service is offline
            console.log( 'Elastic search service is offline' );
        } else if ( error.response.status === 404 ) {
            // Unrecognized index/endpoint
            console.log( 'Unrecognized elastic search index' );
        }

        console.log( error );
        console.log( error.response );
    })
    .finally( () => {
        if (displayLoading) {
            store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        }
    });
}
