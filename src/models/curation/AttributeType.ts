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
export async function API_ATTRIBUTE_TYPE_FETCH( ) {
    const user = store.getters['auth/getUser'];

    try {
        const res = await axios.get( process.env.VUE_APP_ACE_URL! + '/attributetypes?count=100000&activeonly=1', {
            headers: { Authorization: 'Bearer ' + user.access_key },
        });

        if (res.status !== 200) {
            console.error( res );
            console.log( 'Received ' + res.status + ' response code' );
        } else {
            return res.data.data;
        }

    } catch (error) {
        console.log(error);
        throw new Error(error.response.data.message);
    }

    return undefined;
}
