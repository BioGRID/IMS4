import axios from 'axios';
import store from '@/store/store';

// Query Elastic Search
export async function ELASTIC_QUERY( search: object, index: string, displayLoading: boolean, errorCallback?: (error: any) => void ) {

    const user = store.getters['auth/getUser'];
    if (displayLoading) {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
    }

    try {

        const res = await axios.post( process.env.VUE_APP_SEARCH_URL! + '/query/' + index, search, {
            headers: { Authorization: 'Bearer ' + user.access_key },
        });

        // console.log( res );
        // console.log( res.data );

        if (res.status !== 200) {
            console.error( res );
            console.log( 'Recieved ' + res.status + ' response code' );
        } else {
            return res.data;
        }

    } catch (error) {
        console.error( error.response );
        if (errorCallback !== undefined) {
            errorCallback(error);
        }
    } finally {
        if (displayLoading) {
            store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        }
    }

    return undefined;

}

// Get the count of results for a query, rather than the actual results
export async function ELASTIC_COUNT( search: object, index: string ) {
    const user = store.getters['auth/getUser'];

    try {
        const res = await axios.post( process.env.VUE_APP_SEARCH_URL! + '/count/' + index, search, {
            headers: { Authorization: 'Bearer ' + user.access_key },
        });

        if (res.status !== 200) {
            console.error( res );
            console.log( 'Recieved ' + res.status + ' response code' );
        } else {
            return res.data.count;
        }

    } catch (error) {
        console.error( error.response );
    }

    return 0;
}
