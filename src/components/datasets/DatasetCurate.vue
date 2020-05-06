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
                        v-model="selectedWorkflowID"
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
                    <v-btn
                        class='mr-2 ml-4 mb-3'
                        small
                        dark
                        title="Add blocks to this curation workflow"
                        color="primary"
                        @click="addBlock( 'public_note' )"
                    >
                        Add Blocks <v-icon class='ml-1'>mdi-plus</v-icon>
                    </v-btn>
                    <!--<v-dialog persistent max-width="500" v-model="addDialog">
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
                    </v-dialog>-->
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
                        v-model="currentStep"
                        :key="selectedWorkflowID"
                    >
                        <template v-for="(block, entryIndex) in workflow">
                            <v-stepper-step
                                :key="`${selectedWorkflowID}-${entryIndex + 1}-step`"
                                :complete="isBlockComplete(entryIndex)"
                                :step="entryIndex + 1"
                                :editable="true"
                                :rules="[() => isBlockValid(entryIndex)]"
                                color="green darken-3"
                            >
                                {{ block.title }} {{ selectedWorkflowID + "-" + (entryIndex + 1) + "-step" }}
                                <div class='caption pa-0 ma-0'>
                                    <span v-if="block.required"> <span class="red--text">Required</span></span>
                                    <span v-if="block.settings !== undefined && block.settings !== {}">
                                        <span v-if="block.required"> |</span> Rules: {{ buildRulesText(block.settings, block.type) }}
                                    </span>
                                </div>
                            </v-stepper-step>

                            <v-stepper-content
                                :key="`${entryIndex + 1}-content`"
                                :step="entryIndex + 1"
                            >
                                <template v-if="block.type === 'participant'">
                                    <ParticipantBlock
                                        :id="entryIndex"
                                        :name="block.name" 
                                        :required="block.required"
                                        :settings="block.settings"
                                        @complete="completeBlock"
                                        @remove="removeBlock"
                                    ></ParticipantBlock>
                                </template>

                                <template v-else>
                                    <UnknownBlock
                                        :id="entryIndex"
                                        :name="block.name" 
                                        :required="block.required"
                                        :settings="block.settings"
                                        @complete="completeBlock"
                                        @remove="removeBlock"
                                    ></UnknownBlock>
                                </template>
                            </v-stepper-content>
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
import { EntityWorkflowEntry, EntityWorkflowHash, EntityWorkflowBlock } from '@/models/curation/EntityWorkflows';
import ParticipantBlock from '@/components/workflow/ParticipantBlock.vue';
import UnknownBlock from '@/components/workflow/UnknownBlock.vue';
import NoteBlock from '@/components/workflow/NoteBlock.vue';
import notification from '@/utils/Notifications';
import _ from 'lodash';

const curation = namespace( 'curation' );

interface WorkflowRecord {
    name: string;
    id: string;
}

@Component({
    components: {
        ParticipantBlock,
        UnknownBlock,
    },
})
export default class DatasetCurate extends Vue {
    @curation.State private entityFamilies!: EntityFamilyHash;
    @curation.State private entityWorkflows!: EntityWorkflowHash;
    @Prop() private dataset!: any;
    @Prop({type: String, default: ''}) private color!: string;
    @Prop({type: Boolean, default: false }) private dark!: boolean;
    private selectedWorkflowID: string = '';
    private workflow: EntityWorkflowBlock[] = [];
    private activeBlockNames: Record<string, boolean> = {};
    private addDialog: boolean = false;
    private currentStep: number = 1;

    @Watch( 'selectedWorkflowID' )
    private onselectedWorkflowIDChange() {
        if (this.showWorkflow) {
            this.$store.dispatch( 'toggleLoadingOverlay', {} );
            this.workflow = [];
            this.activeBlockNames = {};
            for (const [blockID, block] of Object.entries(this.entityWorkflows[Number(this.selectedWorkflowID)].workflow)) {
                const newBlock = _.cloneDeep(block);
                newBlock.valid = undefined;
                newBlock.state = 'new';
                newBlock.data = undefined;
                this.workflow.push(newBlock);
                this.activeBlockNames[newBlock.name.toUpperCase()] = true;
            }
            this.currentStep = 1;
            this.$store.dispatch( 'toggleLoadingOverlay', {} );
        }

    }

    get isWorkflowValid() {
        for (const [blockID, block] of Object.entries(this.workflow)) {
            if (!block.valid || block.valid === undefined || !(block.state === 'complete')) {
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
        if (this.selectedWorkflowID !== '' && this.selectedWorkflowID !== undefined) {
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
        const block: EntityWorkflowBlock = this.workflow[blockID];
        if (block.valid || block.valid === undefined) {
            return true;
        }

        return false;
    }

    private isBlockComplete( blockID: number ) {
        const block: EntityWorkflowBlock = this.workflow[blockID];
        if (block.state === 'complete') {
            return true;
        }

        return false;
    }

    private completeBlock(blockID: number, blockData: object) {
        const block: EntityWorkflowBlock = this.workflow[blockID];
        block.state = 'complete';
        block.valid = true;
    }

    private removeBlock(blockID: number) {
        const blockName: string = '';
        const block: EntityWorkflowBlock = this.workflow[blockID];
        this.workflow.splice(Number(blockID), 1);
        delete this.activeBlockNames[block.name.toUpperCase()];
        this.currentStep = this.currentStep - 1;
    }

    private buildRulesText( settings: Record<string, string|number>, type: string ) {
        const rules: string[] = [];
        for (const [settingName, settingValue] of Object.entries(settings)) {
            if (type === 'participant') {
                if (settingName === 'min') {
                    rules.push('min ' + String(settingValue));
                } else if (settingName === 'max') {
                    rules.push('max ' + String(settingValue));
                }
            } else if (type === 'ontology') {
                if (settingName === 'min') {
                    rules.push('min ' + String(settingValue));
                } else if (settingName === 'max') {
                    rules.push('max ' + String(settingValue));
                } else if (settingName === 'qualifier_max' && settingValue === 0) {
                    rules.push('no qualifiers');
                } else if (settingName === 'qualifier_max' && settingValue > 0) {
                    rules.push('max qualifications = ' + String(settingValue));
                }
            }
        }
        return rules.join(', ');
    }

    private addBlock( blockName: string ) {
        blockName = blockName.toUpperCase();
        if (this.activeBlockNames[blockName] === undefined) {
            this.workflow.push({
                name: 'public_note',
                title: 'Public Notes',
                description: 'You can enter one or more notes',
                type: 'note',
                required: false,
                settings: {
                    min: 2,
                    max: 2,
                },
                valid: undefined,
                state: 'new',
                data: undefined,
            });
            this.activeBlockNames[blockName] = true;
        } else {
            this.$store.dispatch( 'notify/displayNotification', notification( 'error', 'curate_workflow_blockexists' ), {root: true });
        }
    }

}
</script>

<style lang="scss">
</style>