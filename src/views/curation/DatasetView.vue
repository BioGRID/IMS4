<template>
    <div id="dataset-view">
        <v-container fluid class='pt-0'>
            <v-row dense>
                <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12">
                    <DatasetDetails :dark="darkMode" :collapsed="false" :dataset="dataset" />
                </v-col>
            </v-row>
            <v-row dense>
                <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12">
                    <DatasetTools :dark="darkMode" :dataset="dataset" :history="history" @closeDataset="closeDataset" />
                </v-col>
            </v-row>
            <v-row dense cols="12" xl="12" lg="12" md="12" sm="12" xs="12">
                <v-tabs
                    v-model="tab"
                    background-color="primary"
                    class="elevation-2 mt-1 mb-2"
                    dark
                    :centered="true"
                    :grow="true"
                >

                    <v-tab href="#history">History</v-tab>
                    <v-tab href="#data">Curated Data</v-tab>
                    <v-tab href="#curate">Curate New Data</v-tab>
                    <v-tab href="#notes">Notes</v-tab>

                    <v-tab-item class='' value="history">
                        <HistoryList 
                            :dark="darkMode"
                            :showNote="false"
                            :history="history"
                        ></HistoryList>
                    </v-tab-item>

                    <v-tab-item class='pa-0 ma-0' value="data">
                        <DatasetEntities :dataset="dataset"></DatasetEntities>
                    </v-tab-item>

                </v-tabs>
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
import DatasetEntities from '@/components/datasets/DatasetEntities.vue';
import { HistoryEntry } from '@/models/curation/History';

const curation = namespace( 'curation' );

@Component({
    components: {
        DatasetDetails,
        DatasetTools,
        HistoryList,
        DatasetEntities,
    },
})
export default class DatasetView extends Vue {
    private datasetID: number = 0;
    private darkMode: boolean = false;
    private dataset: any = {};
    private history: HistoryEntry[] = [];
    private tab: string = 'history';
    private isActive: boolean = false;

    private created() {
        this.datasetID = Number(this.$route.params.id);
        this.dataset = this.$store.getters['curation/getOpenDataset'](this.datasetID);
        this.history = this.$store.getters['curation/getOpenHistory'](this.datasetID);
    }

    private closeDataset() {
        this.$store.dispatch( 'curation/remove_dataset', { dataset_id: this.datasetID } ).then( () => {
            this.$store.dispatch( 'incrementPathCache', {path: this.$route.path} );
            this.$destroy();
        });
    }

    private activated() {
        this.isActive = true;
    }

    private deactivated() {
        this.isActive = false;
    }

    private destroyed() {
        if (this.isActive) {
            this.$router.push( '/elements/Dashboard' );
        }
    }

}

</script>