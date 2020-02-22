<template>
    <div id="dashboard">
        <v-container fluid class='pt-0'>
            <v-row dense>
                <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12">
                    <DatasetDetails :dark="darkMode" :collapsed="true" />
                </v-col>
            </v-row>
            <ACEExternalDataTable
                class='mt-1'
                title="Curated Entities"
                tableClass="pa-1"
                :columns="tableHeaders"
                :rowsPerPage="rowsPerPage"
                :displayRows="displayRows"
                :filteredRowCount="filteredRowCount"
                :totalRowCount="totalRowCount"
                :hasExpanded="true"
                :pagination="true"
                :showSearch="true"
                @query="fetchData"
            >
                <template slot="defaultRow" slot-scope="{ row, rowIndex }">
                    <td class='text-center'>
                        <input type="checkbox" :value="row._source.entity_id"></checkbox>
                    </td>
                    <td class='text-center'>{{ extractParticipantNamesByExperimentalRole( row, "bait" ) }}</td>
                    <td class='text-center'>{{ extractParticipantNamesByExperimentalRole( row, "prey" ) }}</td>
                    <td class='text-center'>{{ extractOrganismAbbreviationByExperimentalRole( row, "bait" ) }}</td>
                    <td class='text-center'>{{ extractOrganismAbbreviationByExperimentalRole( row, "prey" ) }}</td>
                    <td class='text-center'>{{ extractExperimentalKeywordAttributeByShortcode( row, "ES" ) }}</td>
                    <td class='text-center'>{{ row._source.history.user_name }}</td>
                    <td class='text-center'>{{ row._source.history.addeddate }}</td>
                </template>
                <template slot="expandedRow" slot-scope="{ row, rowIndex }">
                    <td :colspan='tableHeaders.length + 1'>
                        <v-sheet
                            color="amber lighten-4"
                            class="pa-2"
                        >
                            EXPANDED CONTENT
                        </v-sheet>
                    </td>
                </template>

            </ACEExternalDataTable>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import DatasetDetails from '@/components/datasets/DatasetDetails.vue';
import DatasetTools from '@/components/datasets/DatasetTools.vue';
import HistoryList from '@/components/history/HistoryList.vue';
import ACEExternalDataTable from '@/components/data/ACEExternalDataTable.vue';
import { TableColumn, TableSort } from '@/models/table/Table';
import bodybuilder from 'bodybuilder';
import { ELASTIC_QUERY, ELASTIC_COUNT } from '@/models/elastic/Query';
import { ElasticExtractor } from '@/utils/ElasticExtractor';

const curation = namespace( 'curation' );

@Component({
    components: {
        DatasetDetails,
        ACEExternalDataTable,
    },
})
export default class DatasetView extends Mixins(ElasticExtractor) {
    @curation.State private currentDataset!: any;
    private displayRows: object[] = [];
    private darkMode: boolean = false;
    private totalRowCount: number = 0;
    private filteredRowCount: number = 0;
    private rowsPerPage: number = 123;
    private tableHeaders: TableColumn[] = [
        {
            title: '',
            field: '',
            sortable: false,
            searchable: false,
            searchType: '',
            searchName: '',
            searchTag: undefined,
            sortDirection: '',
            sortOrder: 0,
            sortNested: undefined,
            className: 'text-center',
        },
        {
            title: 'Bait',
            field: 'participants.name_keyword',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Bait',
            searchTag: 'B',
            sortDirection: '',
            sortOrder: 0,
            sortNested: { path: 'participants',  filter: { term: { 'participants.keyword_attributes.ER.text': 'bait' }}},
            className: 'text-center',
        },
        {
            title: 'Prey',
            field: 'participants.name_keyword',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Prey',
            searchTag: 'P',
            sortDirection: '',
            sortOrder: 0,
            sortNested: { path: 'participants',  filter: { term: { 'participants.keyword_attributes.ER.text': 'prey' }}},
            className: 'text-center',
        },
        {
            title: 'Bait Org',
            field: 'participants.organism.abbreviation',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Bait Organism',
            searchTag: 'BO',
            sortDirection: '',
            sortOrder: 0,
            sortNested: { path: 'participants',  filter: { term: { 'participants.keyword_attributes.ER': 'bait' }}},
            className: 'text-center',
        },
        {
            title: 'Prey Org',
            field: 'participants.organism.abbreviation',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Prey Organism',
            searchTag: 'PO',
            sortDirection: '',
            sortOrder: 0,
            sortNested: { path: 'participants',  filter: { term: { 'participants.keyword_attributes.ER': 'prey' }}},
            className: 'text-center',
        },
        {
            title: 'System',
            field: 'keyword_attributes.ES.text',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Email',
            searchTag: 'S',
            sortDirection: '',
            sortOrder: 0,
            sortNested: undefined,
            className: 'text-center',
        },
        {
            title: 'User',
            field: 'history.user_name',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'User',
            searchTag: 'U',
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
            searchTag: 'D',
            sortDirection: 'desc',
            sortOrder: 1,
            sortNested: undefined,
            className: 'text-center',
        },
    ];

    private created() {
        this.getTotalCount();
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

    private fetchData( paginationPage: number, tableSortDetails: TableSort[], sortOrderTracker: number[] ) {
        let query = this.getBaseQuery();

        const sortOptions = this.buildSortOptions( tableSortDetails, sortOrderTracker );

        query = query.size( this.rowsPerPage )
            .from( ((paginationPage - 1) * this.rowsPerPage));

        const formattedQuery: any = query.build();
        formattedQuery.sort = sortOptions;

        ELASTIC_QUERY( formattedQuery, 'entity', true, (data: any) => {
            if (data.hits.total.value > 0 ) {
                this.displayRows = [];
                let hit: any;
                for (hit of data.hits.hits) {
                    hit.is_expanded = false;
                    this.displayRows.push(hit);
                }
                this.filteredRowCount = data.hits.total.value;
            }
        }, (error: any) => {
            console.log(error);
        });

    }

}

</script>