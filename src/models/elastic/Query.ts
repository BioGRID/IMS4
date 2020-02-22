import axios from 'axios';
import store from '@/store/store';

// Query Elastic Search
export function ELASTIC_QUERY( search: object, index: string, displayLoading: boolean, successCallback?: (data: any) => void, errorCallback?: (error: any) => void ) {
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
        console.log( error );
        if (errorCallback !== undefined) {
            errorCallback(error);
        }
    })
    .finally( () => {
        if (displayLoading) {
            store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        }
    });
}

export function ELASTIC_COUNT( search: object, index: string, displayLoading: boolean, successCallback?: (data: any) => void, errorCallback?: (error: any) => void ) {
    const user = store.getters['auth/getUser'];
    if (displayLoading) {
        store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
    }

    return axios.post( process.env.VUE_APP_SEARCH_URL! + '/count/' + index, search, {
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
        console.log( error );
        if (errorCallback !== undefined) {
            errorCallback(error);
        }
    })
    .finally( () => {
        if (displayLoading) {
            store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        }
    });
}
