import axios from 'axios';
import store from '@/store/store';

export interface AttributeTypeEntry {
    attribute_type_id: number;
    name: string;
    attribute_type_category_id: number;
    shortcode: string;
    deprecated: number;
}

export interface AttributeTypeHash {
    [tag: string]: AttributeTypeEntry;
}

// Get Attribute Types from the Curation API
export function API_ATTRIBUTE_TYPE_FETCH( successCallback?: (data: []) => void ): any {
    const user = store.getters['auth/getUser'];
    return axios.get( process.env.VUE_APP_ACE_URL! + '/attributetypes?count=100000&activeonly=1', {
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
        console.log(error);
        throw new Error(error.response.data.message);
    });
}
