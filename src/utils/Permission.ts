import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';
import store from '@/store/store';

export function canAccess(): boolean {
    if (store.getters['auth/isLoggedIn']) {
        return true;
    }
    return false;
}

export function isPermitted(permission: string) {
    return axios.post( process.env.VUE_APP_AUTH_URL! + '/permit', { permission }, {
        headers: {
            Authorization: 'Bearer ' + store.getters['auth/getUser'].access_key,
        },
    });
}
