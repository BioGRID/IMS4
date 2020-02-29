export interface TableColumn {
    title: string;
    field: string;
    sortable: boolean;
    searchable: boolean;
    searchTag?: string | undefined;
    searchName: string;
    sortDirection: string;
    sortOrder: number;
    sortNested?: object | undefined;
    className?: string;
    width?: string;
    formatFunc?: string;
    formatFuncParams?: object;
}

export interface TableSort {
    sortDirection: string;
    sortOrder: number;
}

export interface QueryRestriction {
    type: string;
    field: string;
    value: string;
}

export interface SearchTagLookup {
    [tag: string]: string;
}

export interface ElasticContentField {
    title: string;
    field: string;
}

export interface ElasticContentValue {
    title: string;
    value: string;
}
