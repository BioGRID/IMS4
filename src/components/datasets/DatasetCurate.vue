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
                    <v-card-subtitle>
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
            <v-row no-gutters v-if="showWorkflow">
                <v-col xl="12" lg="12" md="12" sm="12" xs="12">
                    <v-stepper
                        :vertical="false"
                        alt-labels
                        non-linear
                        color="red"
                    >
                        <template v-for="(workflowEntry, entryIndex) in currentWorkflow">
                            <v-stepper-step
                                :key="`${entryIndex + 1}-step`"
                                :complete="false"
                                :step="entryIndex + 1"
                                :editable="true"
                            >
                                {{ workflowEntry.title }}
                                <small>{{ workflowEntry.description }}</small>
                            </v-stepper-step>

                            <v-stepper-content
                                :key="`${entryIndex + 1}-content`"
                                :step="entryIndex + 1"
                            >
                                {{ workflowEntry.description }}
                            </v-stepper-content>

                        </template>
                    </v-stepper>
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

const curation = namespace( 'curation' );

interface WorkflowRecord {
    name: string;
    id: string;
}

@Component
export default class DatasetCurate extends Vue {
    @curation.State private entityFamilies!: EntityFamilyHash;
    @curation.State private entityWorkflows!: EntityWorkflowHash;
    @Prop() private dataset!: any;
    @Prop({type: String, default: ''}) private color!: string;
    @Prop({type: Boolean, default: false }) private dark!: boolean;
    private selectedWorkflow: string = '';
    private currentWorkflow: object = [];

    @Watch( 'selectedWorkflow' )
    private onSelectedWorkflowChange() {
        console.log(this.selectedWorkflow);
        this.currentWorkflow = this.entityWorkflows[this.selectedWorkflow].workflow;
        console.log(this.currentWorkflow);
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

}
</script>

<style lang="scss">
</style>