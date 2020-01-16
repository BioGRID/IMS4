// This is used for generating notification messages
// in a standardized way that can be incorporated into multiple
// different views

import { StringHash, AnyHash } from '@/utils/Interfaces.ts';

export default function notification(type: string, id: string) {
    const colors: StringHash = {
        success: 'success',
        error: 'error',
        warning: 'warning',
        info: 'info',
        default: 'primary',
    };

    // Keep this alphabetical so it's easier to maintain
    // No periods, exclamation marks, question marks etc at end of sentences
    // Start each with capital letter, and all remaining lower case unless
    // they are proper names
    const messages: AnyHash = {
        permission: {
            add: {
                success: 'Successfully added new permission',
                conflict: 'Permission with this name already exists',
                unknown: 'Unable to add permission',
            },
            update: {
                success: 'Successfully updated permission details',
                conflict: 'Permission details conflict with an existing permission. Unable to update',
                unknown: 'Unable to update permission information',
            },
        },
        user: {
            add : {
                success: 'Successfully added new user',
                conflict: 'User information conflicts with an existing user (username or email)',
                unknown: 'Unable to add user',
            },
            update: {
                success: 'Successfully updated user information',
                conflict: 'User information conflicts with an existing user (same name or email)',
                unknown: 'Unable to update user information',
            },
        },
    };

    const getMessage = ( source: string, operation: string, msgtype: string ) => {
        try {
            return messages[source][operation][msgtype];
        } catch(error) {
            return undefined;
        }
    };

    let color: string = colors.default;
    if (colors[type] !== undefined) {
        color = colors[type];
    }

    const idSplit: string[] = id.split('_');
    let message: string = getMessage( idSplit[0], idSplit[1], idSplit[2] );

    if (message === undefined) {
        console.log( 'Notification undefined for ' + id + ' in notifications.ts' );
        message = 'unknown notification';
    }

    return {
        message,
        color,
    };

}
