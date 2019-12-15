import { helpers } from 'vuelidate/lib/validators';

// Check if string has only printable ascii characters
export function printableAsciiOnly( value: string ) {
    if (!helpers.req(value)) {
        return true;
    }

    return /^[\x20-\x7F]*$/.test(value);
}

// Check if string has only ascii characters
export function asciiOnly( value: string ) {
    if (!helpers.req(value)) {
        return true;
    }

    return /^[\x00-\x7F]*$/.test(value);
}

// Check if a string contains only specific characters
export function lettersAndSpacesOnly(value: string) {
    if (!helpers.req(value)) {
        return true;
    }

    return /^[A-Za-z ]*$/.test(value);
}
