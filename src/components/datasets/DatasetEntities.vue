<template>
    <div id="datasetentities">
        <ACEElasticDataTable
            class="pb-2"
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
                        class="pa-2 ml-2 mr-2"
                    >
                        EXPANDED CONTENT
                    </v-sheet>
                </td>
            </template>
        </ACEElasticDataTable>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Prop } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import DatasetTools from '@/components/datasets/DatasetTools.vue';
import ACEElasticDataTable from '@/components/data/ACEElasticDataTable.vue';
import { TableColumn, TableSort, SearchTagLookup } from '@/models/table/Table';
import bodybuilder from 'bodybuilder';
import { ELASTIC_QUERY, ELASTIC_COUNT } from '@/models/elastic/Query';
import { elasticExtract } from '@/utils/ElasticExtractor';
import { buildSearchQuery, buildSortQuery } from '@/utils/ElasticSearchBuilder';

const curation = namespace( 'curation' );

@Component({
    components: {
        ACEElasticDataTable,
    },
})
export default class DatasetEntities extends Vue {
    @curation.State private attributeTypes!: any;
    @curation.State private entityFamilies!: any;
    @Prop() private dataset!: any;
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

    private created() {
        this.getTotalCount();
    }

    get expandedColspan() {
        let addonCols = 0;
        if (this.hasExpanded) { addonCols++; }
        if (this.hasRowCheckbox) { addonCols++; }

        return this.tableHeaders.length + addonCols;
    }

    get tableHeaders() {
        if (this.entityFamilies[1] !== undefined) {
            return this.entityFamilies[1].columns;
        }

        return [];
    }

    private async getTotalCount() {
        const query = this.getBaseQuery();
        const count = await ELASTIC_COUNT( query.build(), 'entity' );
        this.totalRowCount = count;
    }

    private getBaseQuery() {
        return bodybuilder()
            .filter( 'term', 'dataset_id', this.dataset.dataset_id )
            .filter( 'term', 'entity_type.family', 'Binary Interaction' )
            .filter( 'term', 'history.method', 'ACTIVATED' );
    }

    private async fetchData( paginationPage: number, tableSortDetails: TableSort[], sortOrderTracker: number[], searchText: string ) {
        let query = this.getBaseQuery();

        const sortQuery = buildSortQuery( tableSortDetails, sortOrderTracker, this.tableHeaders );

        query = buildSearchQuery( searchText, query, this.searchTagLookup, this.attributeTypes );
        query = query.size( this.rowsPerPage )
            .from( ((paginationPage - 1) * this.rowsPerPage));

        const formattedQuery: any = query.build();
        formattedQuery.sort = sortQuery;

        const data = await ELASTIC_QUERY( formattedQuery, 'entity', true );
        if (data !== undefined && data.hits.total.value > 0) {
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