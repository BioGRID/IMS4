<template>
    <div id="datasetentities">
        <v-container fluid class='pt-0'>
            <v-row dense>
                <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12">
                    <DatasetDetails :dark="darkMode" :collapsed="true" />
                </v-col>
            </v-row>
            <ACEElasticDataTable
                class='mt-1'
                title="Curated Data"
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
                    <td class='text-center'>
                        <input 
                            type="checkbox" 
                            :value="row._source.entity_id" 
                            :checked="row.is_checked"
                        >
                        </checkbox>
                    </td>
                    <td :class="column.className" v-for="(column, colIndex) in tableHeaders">
                        {{ fetchColumnContent( column, row ) }}
                    </td>
                </template>
                <template slot="expandedRow" slot-scope="{ row, rowIndex }">
                    <td :colspan='expandedColspan'>
                        <v-sheet
                            color="amber lighten-4"
                            class="pa-2"
                        >
                            EXPANDED CONTENT
                        </v-sheet>
                    </td>
                </template>

            </ACEElasticDataTable>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import DatasetDetails from '@/components/datasets/DatasetDetails.vue';
import DatasetTools from '@/components/datasets/DatasetTools.vue';
import HistoryList from '@/components/history/HistoryList.vue';
import ACEElasticDataTable from '@/components/data/ACEElasticDataTable.vue';
import { TableColumn, TableSort, SearchTagLookup } from '@/models/table/Table';
import bodybuilder from 'bodybuilder';
import { ELASTIC_QUERY, ELASTIC_COUNT } from '@/models/elastic/Query';
import { elasticExtract } from '@/utils/ElasticExtractor';
import { buildSearchQuery } from '@/utils/ElasticSearchBuilder';

const curation = namespace( 'curation' );

@Component({
    components: {
        DatasetDetails,
        ACEElasticDataTable,
    },
})
export default class DatasetView extends Vue {
    @curation.State private currentDataset!: any;
    private displayRows: object[] = [];
    private darkMode: boolean = false;
    private totalRowCount: number = 0;
    private hasExpanded: boolean = true;
    private hasRowCheckbox: boolean = true;
    private filteredRowCount: number = 0;
    private rowsPerPage: number = 25;
    private searchTagLookup: SearchTagLookup = {
        '#B': 'participant_summary.BAIT.names',
        '#P': 'participant_summary.PREY.names',
        '#BO': 'participant_summary.BAIT.organism_abbreviations',
        '#PO': 'participant_summary.PREY.organism_abbreviations',
        '#U': 'history.user_name',
        '#D': 'history.addeddate',
    };
    private tableHeaders: TableColumn[] = [
        {
            title: 'Bait',
            field: 'participants.name_keyword',
            sortable: true,
            searchable: true,
            searchType: 'Term',
            searchName: 'Bait',
            searchTag: '#B',
            sortDirection: '',
            sortOrder: 0,
            sortNested: { path: 'participants',  filter: { term: { 'participants.keyword_attributes.ER.text': 'bait' }}},
            className: 'text-center',
            formatFunc: 'PN_ER',
            formatFuncParams: { role: 'bait' },
        },
        {
            title: 'Prey',
            field: 'participants.name_keyword',
            sortable: true,
            searchable: true,
            searchType: 'Term',
            searchName: 'Prey',
            searchTag: '#P',
            sortDirection: '',
            sortOrder: 0,
            sortNested: { path: 'participants',  filter: { term: { 'participants.keyword_attributes.ER.text': 'prey' }}},
            className: 'text-center',
            formatFunc: 'PN_ER',
            formatFuncParams: { role: 'prey' },
        },
        {
            title: 'Bait Org',
            field: 'participants.organism.abbreviation',
            sortable: true,
            searchable: true,
            searchType: 'Term',
            searchName: 'Bait Organism',
            searchTag: '#BO',
            sortDirection: '',
            sortOrder: 0,
            sortNested: { path: 'participants',  filter: { term: { 'participants.keyword_attributes.ER': 'bait' }}},
            className: 'text-center',
            formatFunc: 'OABB_ER',
            formatFuncParams: { role: 'bait' },
        },
        {
            title: 'Prey Org',
            field: 'participants.organism.abbreviation',
            sortable: true,
            searchable: true,
            searchType: 'Term',
            searchName: 'Prey Organism',
            searchTag: '#PO',
            sortDirection: '',
            sortOrder: 0,
            sortNested: { path: 'participants',  filter: { term: { 'participants.keyword_attributes.ER': 'prey' }}},
            className: 'text-center',
            formatFunc: 'OABB_ER',
            formatFuncParams: { role: 'prey' },
        },
        {
            title: 'System',
            field: 'keyword_attributes.ES.text',
            sortable: true,
            searchable: true,
            searchType: 'Term',
            searchName: 'Email',
            searchTag: '@ES',
            sortDirection: '',
            sortOrder: 0,
            sortNested: undefined,
            className: 'text-center',
            formatFunc: 'EKA_SC',
            formatFuncParams: { shortcode: 'ES' },
        },
        {
            title: 'User',
            field: 'history.user_name',
            sortable: true,
            searchable: true,
            searchType: 'Term',
            searchName: 'User',
            searchTag: '#U',
            sortDirection: '',
            sortOrder: 0,
            sortNested: undefined,
            className: 'text-center',
        },
        {
            title: 'Date',
            field: 'history.addeddate',
            sortable: true,
            searchable: true,
            searchType: 'Date',
            searchName: 'Date',
            searchTag: '#D',
            sortDirection: 'desc',
            sortOrder: 1,
            sortNested: undefined,
            className: 'text-center',
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
        ELASTIC_COUNT( query.build(), 'entity', false, (data: any) => {
            this.totalRowCount = data.count;
        }, (error: any) => {
            console.log(error);
        });
    }

    private getBaseQuery() {
        return bodybuilder()
            .filter( 'term', 'dataset_id', this.currentDataset.dataset_id )
            .filter( 'term', 'entity_type.family', 'Binary Interaction' )
            .filter( 'term', 'history.method', 'ACTIVATED' );
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

        query = buildSearchQuery( searchText, query, this.searchTagLookup );
        query = query.size( this.rowsPerPage )
            .from( ((paginationPage - 1) * this.rowsPerPage));

        const formattedQuery: any = query.build();
        console.log( formattedQuery );
        formattedQuery.sort = sortOptions;

        ELASTIC_QUERY( formattedQuery, 'entity', true, (data: any) => {
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

    private fetchColumnContent( column: TableColumn, row: any ) {
        if (column.formatFunc === undefined ) {
            return this.fetchObjectValueFromString( row._source, column.field );
        } else {
            return elasticExtract( column.formatFunc, row._source, column.formatFuncParams );
        }
    }

    private fetchObjectValueFromString( obj: any, field: string ) {
        // Converts a string like participants.organism.organism_abbreviation
        // into actual refrences within the obj
        return field.split('.').reduce((o, i) => o[i], obj );
    }

}

</script>