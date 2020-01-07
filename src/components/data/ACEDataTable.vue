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
                    <tr 
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
                    </tr>
                </tbody>
            </table>
            <v-pagination
                v-model="paginationPage"
                :length="paginationSize"
                :page="paginationPage"
            ></v-pagination>
        </v-card>
    </div> 
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
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
    @Prop(Number) private maxRows!: number;
    @Prop(Boolean) private pagination!: boolean;
    private tableSortDetails: ACEDataTableSortDetails[] = [];
    private searchText: string = '';
    private sortOrderTracker: number[] = [];
    private paginationPage: number = 1;
    private paginationSize: number = 1;

    private created() {
        this.initializeSortDetails();
        this.paginationSize = this.rows.length;
    }

    private initializeSortDetails() {
        this.columns.forEach( (column) => {
            this.tableSortDetails.push({
                sortDirection: column.sortDirection,
                sortOrder: column.sortOrder,
            });
        });
    }

    get displayRows() {
        return this.rows.sort( this.defaultSort );
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
            if (this.tableSortDetails[colID].sortDirection === 'desc') {
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