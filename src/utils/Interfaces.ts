// This file contains commonly re-used itnerface
// definitions for use with TypeScript delcarations

export interface StringHash {
    [index: string]: string;
}

export interface NumericHash {
    [index: string]: number;
}

export interface ObjectHash {
    [index: string]: object;
}

export interface AnyHash {
    [index: string]: any;
}
