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
                                {{ panelListValues() }}
                            </span>
                            </v-fade-transition>
                        </v-col>
                        </v-row>
                    </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content >

                    <v-text-field v-for="(item, index) in panelList" :key="index"
                        :placeholder="panelFieldPlaceholder"
                        clearable
                        readonly
                        :value="panelList[index]"
                        @click:clear="deletePanelListItem(index)"
                    >
                    </v-text-field>

                    <v-text-field
                        label="Add New Entry"  
                        :hint="showHint === true ? newHint : ''" 
                        ref="addPanelField" 
                        dense
                        prepend-icon=mdi-plus
                        @click:prepend="addEntry"
                        v-model.trim="newEntry"
                    >
                    </v-text-field>

                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';

export interface EntryMap {
    [id: string]: string;
}

@Component
export default class ExpandableInputPanel extends Vue {
    @Prop({type: String, default: ''}) private panelLabel!: string;
    @Prop({type: String, default: ''}) private panelDesc!: string;
    @Prop({type: Array, default: []}) private panelEntries!: string[];
    @Prop({type: String, default: 'Add New Entry'}) private panelFieldPlaceholder!: string;
    private panelList: EntryMap = {};
    private entryCount: number = 0;
    private showHint: boolean = false;
    private newHint: string = '';
    private newEntry: string = '';

    @Watch( 'panelEntries' )
    private onPanelEntriesChanged() {
        this.buildPanelList();
    }

    private buildPanelList() {
        this.panelList = {};
        for (const entry of this.panelEntries) {
            this.panelList['entry' + this.entryCount] = entry;
            this.entryCount++;
        }
    }

    private deletePanelListItem(index: any) {
       Vue.delete( this.panelList, index );
       this.$emit( 'updateEntries', this.panelListValues() );
    }

    private panelListValues() {
        return Object.values(this.panelList);
    }

    private addEntry() {

        const addPanelField = this.$refs.addPanelField as HTMLElement;

        if ( !this.newEntry ) {
            this.newHint = 'Please add a new entry';
            this.showHint = true;
            addPanelField.focus();
        } else {
            if (Object.values(this.panelList).indexOf(this.newEntry) > -1) {
                this.newHint = 'Entry already exists';
                this.showHint = true;
                addPanelField.focus();
            } else {
                this.panelList['entry' + this.entryCount] = this.newEntry;
                this.entryCount++;
                this.showHint = false;
                this.newEntry = '';
                this.$emit( 'updateEntries', this.panelListValues() );
            }
        }
    }

}
</script>

<style lang="scss">
</style>