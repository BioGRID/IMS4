<template>
    <div class='expandable-input-panel'>
        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <template v-slot:default="{ open }">
                        <v-row no-gutters>
                        <v-col cols="4">{{ panelLabel }}:</v-col>
                        <v-col
                            cols="8"
                            class="text--secondary"
                        >
                            <v-fade-transition leave-absolute>
                            <span
                                v-if="open"
                                key="0"
                            >
                                {{ panelDesc }}
                            </span>
                            <span
                                v-else
                                key="1"
                            >
                                {{ panelDisplayValues() }}
                            </span>
                            </v-fade-transition>
                        </v-col>
                        </v-row>
                    </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content >

                    <ACEDataTable
                        class='mt-5'
                        :title="panelDataTableTitle"
                        tableClass="pa-1"
                        :columns="panelEntryTableHeaders"
                        :rows="panelDisplayRows"
                        :rowsPerPage="100"
                        :totalRows="panelEntryTableCount"
                        :pagination="true"
                        :showSearch="true"
                    >
                        <template slot-scope="{ row, rowIndex }">
                            <td class='text-left' wrap v-for="(column, colIndex) in panelEntryTableHeaders" v-if="colIndex < panelEntryTableHeaders.length - 1">
                                {{ row[column.field] }}
                            </td>
                            <td class='text-center'>
                                <v-btn class="ma-2" color="red" dark @click="deletePanelListItem(row)">Delete
                                    <v-icon dark right>
                                        mdi-delete
                                    </v-icon>
                                </v-btn>
                            </td>
                        </template>

                    </ACEDataTable>

                    <div v-if="this.panelLabel==='Synonyms'">
                        <AddChemicalNameForm
                            :panelDisplayRows="this.panelDisplayRows"
                        ></AddChemicalNameForm>
                    </div>
                    <div v-else>
                        <AddChemicalDBxrefsForm
                            :panelDisplayRows="this.panelDisplayRows"
                        ></AddChemicalDBxrefsForm>
                    </div>
                  
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import ACEDataTable from '@/components/data/ACEDataTable.vue';
import { TableColumn, TableSort, SearchTagLookup } from '@/models/table/Table';
import AddChemicalNameForm from '@/components/forms/AddChemicalNameForm.vue';
import AddChemicalDBxrefsForm from '@/components/forms/AddChemicalDBxrefsForm.vue';

@Component({
    components: {
        ACEDataTable,
        AddChemicalNameForm,
        AddChemicalDBxrefsForm,
    },
})
export default class ExpandableInputPanel extends Vue {
    @Prop({type: String, default: ''}) private panelDataTableTitle!: string;
    @Prop({type: String, default: ''}) private panelLabel!: string;
    @Prop({type: String, default: ''}) private panelDesc!: string;
    @Prop({type: Array}) private fieldsToRemoveEntry!: string[];
    @Prop({type: String, default: 'Add New Entry'}) private panelFieldPlaceholder!: string;
    @Prop({type: Array}) private panelEntryTableHeaders!: any[];
    @Prop({type: Array, default: () => []}) private panelDisplayRows!: any[];
    private entryCount: number = 0;

    get panelEntryTableCount() {
        return this.panelDisplayRows.length;
    }

    private panelDisplayValues() {
        return Object.values(this.panelDisplayRows);
    }

    private deletePanelListItem(rowToDelete: any) {
        // go through fieldsToRemoveEntry and find any matches that need to be deleted
        let indexToRemove = -1;
        for (const [index, val] of this.panelDisplayRows.entries()) {
            let foundHit = true;
            for (const fieldType of this.fieldsToRemoveEntry) {
                if (val[fieldType] !== rowToDelete[fieldType] ) {
                    foundHit = false;
                }
            }
            if ( foundHit ) {
                indexToRemove = index;
            }
        }

        if (indexToRemove !== -1 ) {
            Vue.delete( this.panelDisplayRows, indexToRemove );
            this.$emit( 'updateEntries', this.panelDisplayRows );
        }

    }

}
</script>

<style lang="scss" scoped>
    table {
        tr {
            td {
                padding: 5px;
            }
        }
    }
</style>