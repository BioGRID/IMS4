<template>
    <div class='datasetcurate'>
        <v-card 
            tile
            :color="color"
            :dark="dark"
        >

            <v-row no-gutters>
                <v-col xl="8" lg="8" md="6" sm="12" xs="12">
                    <v-card-title class="pb-0 mb-3 mt-2 headline">
                        <strong>Curate New Data</strong>
                    </v-card-title>
                    <v-card-subtitle class="pb-0">
                        Choose a curation workflow from the right to get started....
                    </v-card-subtitle>
                </v-col>
                <v-col xl="4" lg="4" md="6" sm="12" xs="12">
                    <v-autocomplete
                        v-model="selectedWorkflow"
                        class='pr-5 pl-5 mt-9 mb-0'
                        :items="workflowOptions"
                        :filter="filterWorkflows"
                        label="Select a Workflow"
                        item-text="name"
                        item-value="id"
                        dense
                        attach
                    >
                        <template v-slot:item="data">
                            <option :value="data.item.id">{{ data.item.name }}</option>
                        </template>
                    </v-autocomplete>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col xl="12" lg="12" md="12" sm="12" xs="12">
                    <v-dialog persistent max-width="500" v-model="addDialog">
                        <template v-slot:activator="{ on }">
                            <v-btn
                                v-on="on"
                                class='mr-2 ml-4 mb-3'
                                small
                                dark
                                title="Add blocks to this curation workflow"
                                color="primary"
                            >
                                Add Blocks <v-icon class='ml-1'>mdi-plus</v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title class="headline">Add blocks to this curation workflow?</v-card-title>
                            <v-card-text>You are about to close this dataset. This will remove the dataset from your list of open datasets, but will not change the state of the dataset. If you have any unfinished work for this dataset, it will be lost when closed. Are you sure you want to close the dataset?</v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="red darken-3" dark @click="addDialog = false">Disagree <v-icon class='ml-1'>mdi-close-box</v-icon></v-btn>
                                <v-btn color="green darken-3" dark @click="addDialog = false">Agree <v-icon class='ml-1'>mdi-check</v-icon></v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>
            <v-row no-gutters v-if="showWorkflow">
                <v-col xl="12" lg="12" md="12" sm="12" xs="12">
                    <v-stepper
                        :vertical="true"
                        :alt-labels="false"
                        non-linear
                        class="elevation-0 pb-3"
                        align="left"
                    >
                        <template v-for="(workflowEntry, entryIndex) in currentWorkflow">
                            <template v-if="workflowEntry.visible">
                                <v-stepper-step
                                    :key="`${entryIndex + 1}-step`"
                                    :complete="isBlockComplete(entryIndex)"
                                    :step="entryIndex + 1"
                                    :editable="true"
                                    :rules="[() => isBlockValid(entryIndex)]"
                                    color="green darken-3"
                                >
                                    {{ workflowEntry.title }}
                                    <small>{{ workflowEntry.description }}</small>
                                </v-stepper-step>

                                <v-stepper-content
                                    :key="`${entryIndex + 1}-content`"
                                    :step="entryIndex + 1"
                                >
                                    <template v-if="workflowEntry.type === 'participant'">
                                        <ParticipantBlock 
                                            :name="workflowEntry.type" 
                                            :required="workflowEntry.required"
                                            :settings="workflowEntry.settings"
                                        ></ParticipantBlock>
                                    </template>

                                    <template v-else>
                                        <v-card color="pink lighten-1" height="200px">
                                            Unknown Block
                                        </v-card>
                                    </template>
                                </v-stepper-content>
                            </template>
                        </template>
                    </v-stepper>
                    <v-btn
                        class='mr-2 ml-4 mb-3'
                        large
                        :disabled="!isWorkflowValid"
                        title="Add blocks to this curation workflow"
                        color="success"
                    >
                        Submit Curated Data <v-icon class='ml-1'>mdi-check</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { EntityFamilyEntry, EntityFamilyHash } from '@/models/curation/EntityFamilies';
import { EntityWorkflowEntry, EntityWorkflowHash } from '@/models/curation/EntityWorkflows';
import ParticipantBlock from '@/components/workflow/ParticipantBlock.vue';
import NoteBlock from '@/components/workflow/NoteBlock.vue';

const curation = namespace( 'curation' );

interface WorkflowRecord {
    name: string;
    id: string;
}

@Component({
    components: {
        ParticipantBlock,
    },
})
export default class DatasetCurate extends Vue {
    @curation.State private entityFamilies!: EntityFamilyHash;
    @curation.State private entityWorkflows!: EntityWorkflowHash;
    @Prop() private dataset!: any;
    @Prop({type: String, default: ''}) private color!: string;
    @Prop({type: Boolean, default: false }) private dark!: boolean;
    private selectedWorkflow: string = '';
    private currentWorkflow: object[] = [];
    private addDialog: boolean = false;

    @Watch( 'selectedWorkflow' )
    private onSelectedWorkflowChange() {
        if (this.showWorkflow) {
            this.$store.dispatch( 'toggleLoadingOverlay', {} );
            this.currentWorkflow = this.entityWorkflows[Number(this.selectedWorkflow)].workflow;
            this.$store.dispatch( 'toggleLoadingOverlay', {} );
        } else {
            this.currentWorkflow = [];
        }
    }

    get isWorkflowValid() {
        let currentBlock: Record<string, any> = {};
        for (currentBlock of this.currentWorkflow) {
            if (!currentBlock.valid || currentBlock.valid === undefined || !(currentBlock.state === 'complete')) {
                return false;
            }
        }
        return true;
    }

    get workflowOptions() {
        const options: object[] = [];
        const families: Record<string, Record<string, WorkflowRecord>> = {};

        for (const [familyID, family] of Object.entries(this.entityFamilies)) {
            families[family.name] = {};
        }

        for (const [workflowID, workflow] of Object.entries(this.entityWorkflows)) {
            families[this.entityFamilies[workflow.entity_family_id].name][workflow.name] = { name: workflow.name, id: workflowID };
        }

        for (const familyName of Object.keys(families).sort()) {
            const childWorkflows = families[familyName];
            if (Object.keys(childWorkflows).length > 0) {
                options.push({ header: familyName });
                for (const workflowName of Object.keys(childWorkflows).sort()) {
                    const workflow = childWorkflows[workflowName];
                    options.push({ name: workflow.name, id: workflow.id });
                }
            }
        }

        return options;
    }

    get showWorkflow() {
        if (this.selectedWorkflow !== '' && this.selectedWorkflow !== undefined) {
            return true;
        }
        return false;
    }

    private filterWorkflows( item: any, queryText: string, itemText: string ) {
        if (item.name === undefined) {
            return false;
        }

        const text = item.name.toLowerCase();
        const searchText = queryText.toLowerCase();

        return text.indexOf(searchText) > -1;
    }

    private isBlockValid( blockID: number ) {
        const currentBlock: Record<string, any> = this.currentWorkflow[blockID];
        if (currentBlock.valid || currentBlock.valid === undefined) {
            return true;
        }

        return false;
    }

    private isBlockComplete( blockID: number ) {
        const currentBlock: Record<string, any> = this.currentWorkflow[blockID];
        if (currentBlock.state === 'complete') {
            return true;
        }

        return false;
    }

}
</script>

<style lang="scss">
</style>