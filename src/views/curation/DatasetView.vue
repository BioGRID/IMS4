<template>
    <div id="dashboard">
        <v-container fluid class='pt-0'>
            <v-row dense>
                <v-col cols="12" xl="10" lg="10" md="9" sm="6" xs="6">
                    <DatasetDetails :dark="darkMode" />
                </v-col>
                <v-col cols="12" xl="2" lg="2" md="3" sm="6" xs="6">
                    <DatasetTools :dark="darkMode" />
                </v-col>
            </v-row>
            <v-row dense>
                <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12">
                    <HistoryList 
                        :dark="darkMode"
                        refType="dataset"
                        :refID="datasetID"
                        :showNote="false"
                    ></HistoryList>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import DatasetDetails from '@/components/datasets/DatasetDetails.vue';
import DatasetTools from '@/components/datasets/DatasetTools.vue';
import HistoryList from '@/components/history/HistoryList.vue';

const curation = namespace( 'curation' );

@Component({
    components: {
        DatasetDetails,
        DatasetTools,
        HistoryList,
    },
})
export default class DatasetView extends Vue {
    @curation.State private currentDataset!: any;
    @curation.State private curationDrawerLinks!: object[];
    private darkMode: boolean = false;

    private created() {
        this.$store.dispatch( 'curation/build_curation_drawer_links', {} );
    }

    get datasetID() {
        return this.currentDataset.dataset_id;
    }

}

</script>