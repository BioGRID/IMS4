<template>
    <div class="ace-data-table">
        <v-card>
            <v-row no-gutters>
                <v-col xl="8" lg="8" md="6" sm="12" xs="12">
                    <v-card-title class="pb-0 mb-3">
                        {{ title }}
                    </v-card-title>
                    <v-card-subtitle>
                        Showing <strong>{{ this.startRange }}</strong> to <strong>{{ this.endRange }}</strong> of <strong>{{ this.filteredRowCount }}</strong> entries <span v-if="this.filteredRowCount !== this.totalRows">(filtered from <strong>{{ this.totalRows }}</strong> total entries)</span>
                    </v-card-subtitle>
                </v-col>
                <v-col xl="4" lg="4" md="6" sm="12" xs="12">
                    <v-text-field
                        v-if="showSearch"
                        v-model="searchText"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                        :clearable="true"
                        @keyup.enter="filterSubmit()"
                        @click:append="filterSubmit()"
                        class='pr-5 pl-5 mt-3 mb-2'
                    ></v-text-field>
                </v-col>
            </v-row>
            <table :class='tableClass'>
                <thead>
                    <tr>
                        <th
                            v-for="(column,index) in columns" 
                            :class="columnClass(column)"
                            :key="index"
                            @click="column.sortable ? sortBy(index) : null"
                        >
                            {{ column.title }}
                            <v-icon v-if="tableSortDetails[index].sortDirection === 'asc'"
                                dark
                                small
                            >
                                mdi-arrow-up
                            </v-icon>
                            <v-icon v-if="tableSortDetails[index].sortDirection === 'desc'"
                                dark
                                small
                            >
                                mdi-arrow-down
                            </v-icon>
                            <v-icon v-if="tableSortDetails[index].sortOrder && tableSortDetails[index].sortDirection"
                                dark
                                small
                            >
                                mdi-numeric-{{ tableSortDetails[index].sortOrder }}-box
                            </v-icon>
                        </th>
                    </tr>
                </thead>
                
                <tbody>
                    <tr v-for="(row, rowIndex) in displayRows" :key="rowIndex">
                        <slot :row="row"></slot>
                    </tr>
                    <!--<tr 
                        v-for="(row, rowIndex) in displayRows"
                        :key="rowIndex"
                    >
                        <td
                            v-for="(column, colIndex) in columns"
                            :class="rowClass(column)"
                            :key="colIndex"
                        >
                            {{ row[column.field] }}
                        </td>
                    </tr>-->
                </tbody>
            </table>
            <v-pagination
                v-if="showPagination"
                v-model="paginationPage"
                :length="paginationSize"
                :page="paginationPage"
                dark
                total-visible="8"
                class="mt-5"
            ></v-pagination>
        </v-card>
    </div> 
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ACEDataTableHeader from '@/components/data/ACEDataTableHeader.vue';

interface ACEDataTableColumn {
    title: string;
    field: string;
    sortable: boolean;
    searchable: boolean;
    searchType: string;
    searchName: string;
    sortDirection: string;
    sortOrder: number;
    className?: string;
}

interface ACEDataTableSortDetails {
    sortDirection: string;
    sortOrder: number;
}

interface NumericHash {
    [sortOrder: string]: number;
}

@Component({
    components: {
        ACEDataTableHeader,
    },
})
export default class ACEDataTable extends Vue {
    @Prop(String) private title!: string;
    @Prop(Boolean) private showSearch!: boolean;
    @Prop(Array) private columns!: ACEDataTableColumn[];
    @Prop(Array) private rows!: object[];
    @Prop(Number) private rowsPerPage!: number;
    @Prop(Number) private totalRows!: number;
    @Prop(Boolean) private pagination!: boolean;
    @Prop(String) private tableClass!: string;
    private tableSortDetails: ACEDataTableSortDetails[] = [];
    private searchText: string = '';
    private sortOrderTracker: number[] = [];
    private paginationPage: number = 1;
    private paginationSize: number = 1;
    private displayRows: object[] = [];
    private filteredRowCount: number = this.totalRows;
    private startRange: number = 1;
    private endRange: number = this.rowsPerPage;
    private loading: boolean = true;
    private showPagination: boolean = this.pagination;

    private created() {
        this.initializeSortDetails();
        this.setupPagination();
        this.generateDisplayRows();
    }

    private initializeSortDetails() {
        const sortData: NumericHash = {};
        this.columns.forEach( (column, columnIndex) => {
            this.tableSortDetails.push({
                sortDirection: column.sortDirection,
                sortOrder: column.sortOrder,
            });

            if (column.sortOrder >= 0 && column.sortDirection !== '') {
                sortData[column.sortOrder] = columnIndex;
            }
        });

        const defaultSortTracker: number[] = [];
        Object.keys(sortData).sort().forEach( (key) => {
            defaultSortTracker.push(sortData[key]);
        });

        this.sortOrderTracker = defaultSortTracker;

    }

    @Watch( 'rowsPerPage' )
    private onRowsPerPageChanged() {
        this.setupPagination();
    }

    @Watch( 'paginationPage' )
    private onPaginationPageChanged() {
        this.generateDisplayRows();
    }

    @Watch( 'searchText' )
    private onSearchTextChanged() {
        if ((this.searchText === null || this.searchText === '')) {
            this.generateDisplayRows();
        }
    }

    private filterSubmit() {
        this.paginationPage = 1;
        this.generateDisplayRows();
    }

    private setupPagination() {
        const rowsToShow = this.rowsPerPage;
        let numPages = Math.floor(this.filteredRowCount / rowsToShow);
        if ((this.filteredRowCount % this.rowsPerPage) > 0) {
            numPages += 1;
        }
        this.paginationSize = numPages;
        if (numPages <= 1) {
            this.showPagination = false;
        } else {
            this.showPagination = true;
        }
    }

    private generateDisplayRows() {
        this.$store.dispatch( 'toggleLoadingOverlay', {} );
        const displayRows = this.rows.filter( this.defaultFilter ).sort( this.defaultSort );
        this.filteredRowCount = displayRows.length;
        this.displayRows = displayRows.slice( (this.paginationPage - 1) * this.rowsPerPage, this.paginationPage * this.rowsPerPage );
        this.startRange = ((this.paginationPage - 1) * this.rowsPerPage) + 1;
        const endRange = this.paginationPage * this.rowsPerPage;
        if (endRange > this.filteredRowCount) {
            this.endRange = this.filteredRowCount;
        } else {
            this.endRange = endRange;
        }
        this.setupPagination();
        this.$store.dispatch( 'toggleLoadingOverlay', {} );
    }

    private sortBy(index: number) {
        if (index in this.tableSortDetails) {
            if (this.tableSortDetails[index].sortDirection === 'asc') {
                this.tableSortDetails[index].sortDirection = 'desc';
            } else if (this.tableSortDetails[index].sortDirection === '') {
                this.tableSortDetails[index].sortDirection = 'asc';
                this.sortOrderTracker.push(index);
                this.tableSortDetails[index].sortOrder = this.sortOrderTracker.indexOf(index) + 1;
            } else {
                this.tableSortDetails[index].sortDirection = '';
                this.tableSortDetails[index].sortOrder = 0;
                // Remove this one from the tracker
                this.sortOrderTracker = this.sortOrderTracker.filter( (colID) => colID !== index );
                // Update all remaining entries in the tracker, in case order has
                // changed from what it was previously
                this.sortOrderTracker.forEach( (trackerIndex) => {
                    this.tableSortDetails[trackerIndex].sortOrder = this.sortOrderTracker.indexOf(trackerIndex) + 1;
                });
            }
            this.generateDisplayRows();
        }
    }

    private columnClass(column: ACEDataTableColumn) {
        const classes = [];
        if (column.className !== undefined && column.className !== '' ) {
            classes.push(column.className);
        }
        if (column.sortable) {
            classes.push('columnSortable');
        }
        return classes.join(' ');
    }

    private rowClass(column: ACEDataTableColumn) {
        const classes = [];
        if (column.className !== undefined && column.className !== '' ) {
            classes.push(column.className);
        }

        return classes.join(' ');
    }

    private defaultSort( a: any, b: any ) {
        if (this.sortOrderTracker.length <= 0) {
            return a[this.columns[0].field] - b[this.columns[0].field];
        }

        for (const colID of this.sortOrderTracker) {
            let directionModifier = 1;
            if (this.tableSortDetails[colID].sortDirection === 'asc') {
                directionModifier = -1;
            }

            const aval = a[this.columns[colID].field];
            const bval = b[this.columns[colID].field];

            if (aval > bval) {
                return -1 * directionModifier;
            } else if (aval < bval) {
                return 1 * directionModifier;
            }
        }

        return 0;
    }

    private defaultFilter( item: any ) {
        if (this.searchText === null || this.searchText === '' ) {
            return true;
        }

        let foundMatch = false;
        for (const column of this.columns) {
            if ( column.searchable ) {
                foundMatch = this.compareByString( item[column.field], this.searchText );
                if (foundMatch) {
                    return true;
                }
            }
        }

        return false;
    }

    private compareByString( value: any, search: string ) {
        return value != null &&
        search != null &&
        typeof value !== 'boolean' &&
        value.toString().toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) !== -1;
    }

}

</script>

<style lang="scss" scoped>
    table {
        width: 100%;
        border-spacing: 1px;
        &.smallFont {
            font-size: 12px;
        }
        tr {
            border: 0;
            th {
                font-size: 14px;
                background-color: var(--v-info-base);
                color: #FFF;
                border: 0;
                margin: 0;          
                padding: 5px;

                &.columnSortable {
                    cursor: pointer;
                }
            }

            td {
                padding: 5px;
            }
        }
    }
</style>