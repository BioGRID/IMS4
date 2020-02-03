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

const curation = namespace( 'curation' );

@Component
export default class DatasetLoad extends Vue {
    @curation.State private currentDataset!: any;
    private datasetType: string = '';
    private datasetSourceID: number = 0;
    private searchQuery: string = '';

    public created() {
        this.datasetSourceID = Number(this.$route.params.id);
        this.datasetType = this.$route.params.type;
        this.fetchDataset();
    }

    private fetchDataset() {
        this.$store.dispatch( 'curation/fetch_current_dataset', {
            sourceID: this.datasetSourceID,
            sourceType: this.datasetType,
        });
    }

}

</script>
