<template>
    <div id="chemical-manager">
        <v-container fluid class='pt-0'>
            <v-btn 
                class='float-right mt-4'
                small
                color='primary'
                to='/elements/admin'
                dark
            >
                < Back
            </v-btn>
            
            <h1>Chemical Manager</h1>
            
            <div class="subtitle-1">Search for existing chemicals in the BioGRID or add new chemicals.</div>

            <v-btn 
                class='mt-4'
                small
                color='green darken-2'
                to='/admin/chemical/chemicaladd'
                dark
                :ripple="true"
            >
                Add New Chemical 
                <v-icon class='ml-2'>mdi-account-plus</v-icon>
            </v-btn>
             
            <ACEElasticDataTable
                class='mt-5'
                title="Chemicals"
                tableClass="pa-1"
                :columns="tableHeaders"
                :rowsPerPage="rowsPerPage"
                :displayRows="displayRows"
                :filteredRowCount="filteredRowCount"
                :totalRowCount="totalRowCount"
                :hasExpanded="hasExpanded"
                :hasRowCheckbox="hasRowCheckbox"
                :pagination="true"
                :showSearch="true"
                @query="fetchData"
            >

                <template slot="defaultRow" slot-scope="{ row, rowIndex }">
                    <td class='text-left pa-3' nowrap>{{ row._source.chemical_id }}</td>
                    <td class='text-left pa-3'>{{ row._source.name }}</td>
                    <td class='text-left pa-3' wrap>{{ row._source.description }}</td>
                    <td class='text-left pa-3' nowrap>{{ row._source.chemical_type }}</td>
                    <td class='text-left pa-3' nowrap>{{ row._source.source }}</td>
                    <td class='text-left pa-3' nowrap>{{ row._source.source_id }}</td>
                    <td class='nowrap text-center pa-3'>
                        <v-btn 
                            x-small 
                            dark 
                            fab 
                            elevation="0" 
                            color="info" 
                            :title='"Edit chemical: " + row._source.name' 
                            :to="'/admin/chemical/chemicaledit/' + row._source.chemical_id"
                        >
                            <v-icon>mdi-account-edit</v-icon>
                        </v-btn>
                    </td>   
                </template>
                <template slot="expandedRow" slot-scope="{ row, rowIndex }">
                    <td :colspan='expandedColspan'>
                        <v-sheet
                            color="amber lighten-4"
                            class="pa-2"
                        >
                            <ul>
                                <li><strong>InChi</strong>: {{ row._source.inchi }}</li>
                                <li><strong>InChiKey</strong>: {{ row._source.inchikey }}</li>
                                <li><strong>Molecular Formula</strong>: {{ row._source.formula }}</li>
                                <li><strong>Smile</strong>: {{ row._source.smile }}</li>
                            </ul>

                        </v-sheet>
                    </td>
                </template>

            </ACEElasticDataTable>
        

        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';

import ACEElasticDataTable from '@/components/data/ACEElasticDataTable.vue';
import { TableColumn, TableSort, SearchTagLookup } from '@/models/table/Table';
import bodybuilder from 'bodybuilder';
import { ELASTIC_QUERY, ELASTIC_COUNT } from '@/models/elastic/Query';
import { buildSearchQuery } from '@/utils/ElasticSearchBuilder';

@Component({
    components: {
        ACEElasticDataTable,
    },
})
export default class ChemicalManager extends Vue {
    private displayRows: object[] = [];
    private darkMode: boolean = false;
    private totalRowCount: number = 0;
    private hasExpanded: boolean = true;
    private hasRowCheckbox: boolean = false;
    private filteredRowCount: number = 0;
    private rowsPerPage: number = 25;
    private searchTagLookup: SearchTagLookup = {
        '#CID': 'chemical_id',
        '#CN': 'name',
        '#CT': 'chemical_type',
        '#CD': 'description',
        '#CS': 'source',
        '#CSID': 'source_id',
    };
    private tableHeaders: TableColumn[] = [
         {
            title: 'ID',
            field: 'chemical_id',
            sortable: true,
            searchable: true,
            searchTag: '#CID',
            searchName: 'ID',
            sortDirection: 'asc',
            sortOrder: 1,
            sortNested: undefined,
            className: 'text-center',
        },
        {
            title: 'Name',
            field: 'name_keyword',
            sortable: true,
            searchable: true,
            searchTag: '#CN',
            searchName: 'Name',
            sortDirection: '',
            sortOrder: 0,
            sortNested: undefined,
            className: 'text-left',
        },
        {
            title: 'Description',
            field: 'description',
            sortable: true,
            searchable: true,
            searchTag: '#CD',
            searchName: 'Description',
            sortDirection: '',
            sortOrder: 0,
            sortNested: undefined,
            className: 'text-left',
        },
        {
            title: 'Chemical Type',
            field: 'chemical_type',
            sortable: true,
            searchable: true,
            searchTag: '#CT',
            searchName: 'Chemical Type',
            sortDirection: '',
            sortOrder: 0,
            sortNested: undefined,
            className: 'text-left',
        },
        {
            title: 'Source',
            field: 'source',
            sortable: true,
            searchable: true,
            searchTag: '#CS',
            searchType: 'Text',
            searchName: 'Source',
            sortDirection: '',
            sortOrder: 0,
            sortNested: undefined,
            className: 'text-left',
        },
        {
            title: 'Source ID',
            field: 'source_id',
            sortable: true,
            searchable: true,
            searchTag: '#CSID',
            searchType: 'Text',
            searchName: 'Source ID',
            sortDirection: '',
            sortOrder: 0,
            sortNested: undefined,
            className: 'text-left',
        },
        {
            title: 'Tools',
            field: 'tools',
            sortable: false,
            searchable: false,
            searchTag: '',
            searchType: '',
            searchName: 'Tools',
            sortDirection: '',
            sortOrder: 0,
            sortNested: undefined,
            className: 'nowrap text-center',
        },
    ];

    private created() {
        this.getTotalCount();
    }

    get expandedColspan() {
        let addonCols = 0;
        if (this.hasExpanded) { addonCols++; }
        if (this.hasRowCheckbox) { addonCols++; }

        return this.tableHeaders.length + addonCols;
    }

    private getTotalCount() {
        const query = this.getBaseQuery();
        ELASTIC_COUNT( query.build(), 'chemical', false, (data: any) => {
            this.totalRowCount = data.count;
        }, (error: any) => {
            console.log(error);
        });
    }

    private getBaseQuery() {
        return bodybuilder()
            .filter( 'term', 'deprecated', false );
    }

    private buildSortOptions( tableSortDetails: TableSort[], sortOrderTracker: number[] ) {
        const sortOptions = [];
        for (const colID of sortOrderTracker) {
            const sortOption: any = {};
            const col = this.tableHeaders[colID];
            sortOption[col.field] = {
                order: tableSortDetails[colID].sortDirection,
            };

            if (col.sortNested !== undefined) {
                sortOption[col.field].nested = col.sortNested;
            }

            sortOptions.push(sortOption);
        }
        return sortOptions;
    }

    private fetchData( paginationPage: number, tableSortDetails: TableSort[], sortOrderTracker: number[], searchText: string ) {
        let query = this.getBaseQuery();

        const sortOptions = this.buildSortOptions( tableSortDetails, sortOrderTracker );

        query = buildSearchQuery( searchText, query, this.searchTagLookup, {} );
        query = query.size( this.rowsPerPage )
            .from( ((paginationPage - 1) * this.rowsPerPage));

        const formattedQuery: any = query.build();
        formattedQuery.sort = sortOptions;

        ELASTIC_QUERY( formattedQuery, 'chemical', true, (data: any) => {
            if (data.hits.total.value > 0 ) {
                this.displayRows = [];
                let hit: any;
                for (hit of data.hits.hits) {
                    hit.is_expanded = false;
                    hit.is_checked = false;
                    this.displayRows.push(hit);
                }
                this.filteredRowCount = data.hits.total.value;
            } else {
                this.displayRows = [];
                this.filteredRowCount = 0;
            }
        }, (error: any) => {
            console.log(error);
        });

    }

    private displayExpandedContent( row: any ) {
        return 'THIS IS EXPANDED CONTENT NOW';
    }

}
</script>

<style lang="scss" scoped>
</style>

