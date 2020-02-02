<template>
    <div id="dashboard">
        <v-container fluid class='pt-0'>
            <v-row dense>
                <v-col cols="12" xl="10" lg="10" md="9" sm="6" xs="6">
                    <DatasetDetails />
                </v-col>
                <v-col cols="12" xl="2" lg="2" md="3" sm="6" xs="6">
                    <DatasetTools />
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

const curation = namespace( 'curation' );

@Component({
    components: {
        DatasetDetails,
        DatasetTools,
    },
})
export default class DatasetView extends Vue {

}

</script>