// import axios from 'axios';
import store from '@/store/store';

export function canAccess(): boolean {
    if (store.getters['auth/isLoggedIn']) {
        return true;
    }
    return false;
}

function convertPermissionLevelToInteger( permissionLevel: string ) {
    switch (permissionLevel) {
        case 'observer': return 0;
        case 'standard': return 1;
        case 'manager': return 2;
        case 'poweruser': return 3;
        case 'admin': return 4;
    }

    return 5;
}

export function isPermitted(permissionName: string) {

    // Get Logged in User Permission Class
    const userClass = store.getters['auth/getUserClass'];
    const userPerm = convertPermissionLevelToInteger(userClass);

    // Get User Class for passed in permission name
    const reqClass = store.getters['auth/getPermission'](permissionName);
    const reqPerm = convertPermissionLevelToInteger(reqClass.level);

    if (reqPerm === 5) {
        console.error( 'Permission required for this page is undefined. You must add it first' );
    }

    if (userPerm >= reqPerm) {
        return true;
    }

    return false;

}
