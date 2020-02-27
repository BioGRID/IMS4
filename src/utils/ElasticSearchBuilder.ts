
import { TableColumn } from '@/models/table/Table';

export function buildSearchQuery( searchText: string, queryStructure: any, columns: TableColumn[] ) {
    if (searchText === null || searchText === undefined || searchText.length <= 0) {
        return queryStructure;
    }

    console.log(searchText);

    queryStructure = queryStructure.query( 'query_string', {
        query: searchText,
        default_field: 'all_text',
    });

    return queryStructure;

}
