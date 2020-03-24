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

const curation = namespace( 'curation' );

@Component
export default class DatasetLoad extends Vue {
    @curation.State private currentDataset!: any;
    private datasetType: string = '';
    private datasetSourceID: number = 0;
    private searchQuery: string = '';
    private fetchPubmedPriority: number = 55;

    public created() {
        this.datasetSourceID = Number(this.$route.params.id);
        this.datasetType = this.$route.params.type;
        this.fetchDataset();
    }

    private async fetchDataset() {
        this.$store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        const status = await this.$store.dispatch( 'curation/fetch_current_dataset', {
            sourceID: this.datasetSourceID,
            sourceType: this.datasetType,
        });

        try {
            if (status === undefined) {
                this.$router.push( '/elements/Dashboard' );
            } else if (status === true) {
                this.$router.push( '/curation/DatasetView' );
            } else {
                // No pubmed has been found to already exist
                console.log( 'NO FIND' );
                // Create a task to grab the pubmed
                const payload = createProcessingTask( 'fetch_pubmed', { id: this.$route.params.id }, null, this.fetchPubmedPriority );
                console.log( payload );
                const taskdata = await API_TASK_ADD( payload );
                if (taskdata !== undefined) {
                    // Wait here for up to X second until the task we submitted shows up in the processing tasks list
                    // Once it does, recall fetch_current_dataset
                    // if it doesn't, give warning about high traffic and try again later
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
