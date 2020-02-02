<template>
    <div id="dashboard">
        <v-container fluid class='pt-0'>
            <h1>Loading dataset </h1>
            <h2>{{ datasetType }}</h2>
            <h3>{{ datasetSourceID }}</h3>
            <p>{{ currentDataset }}</p>
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
