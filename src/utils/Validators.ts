import { helpers } from 'vuelidate/lib/validators';
import { isStringInArrayOfObjects, isNumeric } from '@/utils/HelperUtils';

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

// Check to see if a password is of sufficient complexity
export function passwordComplexity(value: string) {
    if (!helpers.req(value)) {
        return true;
    }

    // Must include at least one uppercase letter
    if (false === /[A-Z]/.test(value)) {
        return false;
    }

    // Must include at least one number
    if (false === /\d/.test(value)) {
        return false;
    }

    // Must include at least one symbol
    if (false === /[!@#\$%\^&*()\-=+,<>\?\[\]\{\}|;:]/.test(value)) {
        return false;
    }

    return true;
}

// Wrapper function for isStringInArrayOfObjects so it can be called by the form validator
export function inArrayOfObjects(listOfOptions: any[], valueType: string, listOfAdditionalValues: any[]) {
    return (value: string) => {
        if (!helpers.req(value)) {
            return true;
        }
        return isStringInArrayOfObjects( value, listOfOptions, valueType, listOfAdditionalValues );
    };
}

export function complexNumeric( value: string ) {
    if (!helpers.req(value)) {
        return true;
    }

    return isNumeric(value);
}

export function complexNumericNewlines( value: string ) {
    if (!helpers.req(value)) {
        return true;
    }

    const numericValues = value.split(/[\r\n]+/);
    let isValid = true;
    for (const val of numericValues) {
        if (!isNumeric(val.trim())) {
            isValid = false;
            break;
        }
    }

    return isValid;

}
