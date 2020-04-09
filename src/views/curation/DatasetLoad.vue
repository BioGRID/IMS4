<template>
    <div id="dashboard">
        <v-container fluid class='pt-0'>
            <div v-if='this.datasetType === "pubmed"'>
                <h1>Contacting PubMed to retrieve dataset...</h1>
                <v-progress-linear
                    indeterminate
                    color="blue"
                ></v-progress-linear>
                <p class='title'>Attempting to retreive dataset from the pubmed remote api. You will be redirected as soon as soon as the dataset is available...</p>
                <v-img src='@/assets/pubmed_logo.png' width='300'></v-img>
            </div>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { API_TASK_ADD, createProcessingTask } from '@/models/curation/ProcessingTask';
import { asyncTimeout } from '@/utils/HelperUtils';
import notification from '@/utils/Notifications';

const curation = namespace( 'curation' );

@Component
export default class DatasetLoad extends Vue {
    @curation.State private processingTasks!: any;
    private datasetType: string = '';
    private datasetSourceID: number = 0;
    private searchQuery: string = '';
    private fetchPubmedPriority: number = 55;
    private maxTaskCheckAttempts: number = 20;
    private asyncTimeoutTime: number = 1000;

    public created() {
        this.datasetSourceID = Number(this.$route.params.id);
        this.datasetType = this.$route.params.type;
        this.fetchDataset();
    }

    private async fetchDataset() {
        this.$store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        let datasetID: number | undefined = await this.$store.dispatch( 'curation/fetch_dataset', {
            sourceID: this.datasetSourceID,
            sourceType: this.datasetType,
        });

        try {
            if (datasetID === undefined) {
                this.$router.push( '/elements/Dashboard' );
            } else if (datasetID !== 0) {
                this.$store.dispatch( 'curation/add_curation_drawer_link', { dataset_id: datasetID });
                this.$router.push( '/curation/DatasetView/' + datasetID );
            } else {
                // No pubmed has been found to already exist
                // Create a task to grab the pubmed
                const payload = createProcessingTask( 'fetch_pubmed', { id: this.$route.params.id }, null, this.fetchPubmedPriority );
                const taskdata = await API_TASK_ADD( payload );
                console.log( taskdata );
                if (taskdata !== undefined) {
                    const taskID = taskdata.processing_id;
                    datasetID = 0;
                    // Wait here for up to maxTaskCheckAttempts or until the task
                    // we submitted shows up in the processing tasks list
                    for (let i = 0; i < this.maxTaskCheckAttempts; i++) {
                        console.log( 'Loop ' + i );
                        await asyncTimeout( this.asyncTimeoutTime );
                        if (this.processingTasks[taskID] !== undefined) {
                            console.log( 'TASK ARRIVED' );
                            // Check for errors here, if we find some, deal with them here

                            // If it's complete, re-call fetch_current_dataset
                            datasetID = await this.$store.dispatch( 'curation/fetch_dataset', {
                                sourceID: this.datasetSourceID,
                                sourceType: this.datasetType,
                            });
                            break;
                        }
                    }

                    if (datasetID !== undefined && datasetID !== 0) {
                        // We've now fetched successfully, take us to the page
                        this.$store.dispatch( 'curation/add_curation_drawer_link', { dataset_id: datasetID });
                        this.$router.push( '/curation/DatasetView/' + datasetID );
                    } else {
                        // We've failed yet again. Show an error message and go
                        // back to the dashboard. Could be because there are too many
                        // tasks running
                        this.$store.dispatch( 'notify/displayNotification', notification( 'error', 'dataset_fetch_timeout' ), {root: true });
                        this.$router.push( '/elements/Dashboard' );
                    }

                } else {
                    // Unable to submit the task
                }
            }
        } finally {
            this.$store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        }
    }

}

</script>
