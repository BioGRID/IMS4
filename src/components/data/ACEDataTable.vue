<template>
    <div class="ace-data-table">
        <v-card>
            <v-card-title>
                {{ title }}
                <v-spacer v-if="showSearch"></v-spacer>
                <v-text-field
                    v-if="showSearch"
                    v-model="searchText"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field> 
            </v-card-title>
            <table>
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
                </tbody>
            </table>
        </v-card>
    </div> 
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ACEDataTableHeader from '@/components/data/ACEDataTableHeader.vue';

interface ACEDataTableColumn {
    title: string;
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

@Component({
    components: {
        ACEDataTableHeader,
    },
})
export default class ACEDataTable extends Vue {
    @Prop(String) private title!: string;
    @Prop(Boolean) private showSearch!: boolean;
    @Prop(Array) private columns!: ACEDataTableColumn[];
    // private tableHeaders: ACEDataTableColumn[] = [];
    private tableSortDetails: ACEDataTableSortDetails[] = [];
    private searchText: string = '';
    // private sortOptions: { [key: number]: string } = {};
    private sortOrderTracker: number[] = [];

    private created() {
        this.initializeSortDetails();
    }

    private initializeSortDetails() {
        this.columns.forEach( (column) => {
            this.tableSortDetails.push({
                sortDirection: column.sortDirection,
                sortOrder: column.sortOrder,
            });
        });
    }

    private initializeTableHeaders() {
        /* this.columns.forEach( (column) => {
            const columnCopy = Object.assign({}, column);
            this.tableHeaders.push(columnCopy);
        }); */
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
        }
        /* if (index in this.tableHeaders) {
            if (this.tableHeaders[index].sortDirection === 'asc') {
                this.tableHeaders[index].sortDirection = 'desc';
            } else if (this.tableHeaders[index].sortDirection === '') {
                this.tableHeaders[index].sortDirection = 'asc';
                this.sortOrderTracker.push(index);
                this.tableHeaders[index].sortOrder = this.sortOrderTracker.indexOf(index) + 1;
            } else {
                this.tableHeaders[index].sortDirection = '';
                this.tableHeaders[index].sortOrder = 0;
                // Remove this one from the tracker
                this.sortOrderTracker = this.sortOrderTracker.filter( (colID) => colID !== index );
                // Update all remaining entries in the tracker, in case order has
                // changed from what it was previously
                this.sortOrderTracker.forEach( (trackerIndex) => {
                    this.tableHeaders[trackerIndex].sortOrder = this.sortOrderTracker.indexOf(trackerIndex) + 1;
                });
            }
        } */
        /* if (index in this.sortOptions) {
            if (this.sortOptions[index] === 'asc') {
                // If already sorting ascending, switch to descending
                this.sortOptions[index] = 'desc';
                this.tableHeaders[index].sortDirection = 'desc';
            } else {
                // If already on descending, remove the sort option
                delete this.sortOptions[index];
                this.tableHeaders[index].sortDirection = '';
                this.sortOrder = this.sortOrder.filter( (colID) => colID !== index );
            }
        } else {
            this.sortOptions[index] = 'asc';
            this.tableHeaders[index].sortDirection = 'asc';
            this.sortOrder.push(index);
        } */

        // this.tableHeaders[index].title = this.tableHeaders[index].sortDirection;

        /* console.log(this.sortOptions);
        console.log(this.sortOrder); */
        // console.log(this.tableHeaders);
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

}

</script>

<style lang="scss" scoped>
    table {
        width: 100%;
        border-spacing: 1px;
        tr {
            border: 0;
            th {
                font-size: 14px;
                background-color: var(--v-primary-base);
                color: #FFF;
                border: 0;
                margin: 0;          
                padding: 5px;

                &.columnSortable {
                    cursor: pointer;
                }
            }
        }
    }
</style>