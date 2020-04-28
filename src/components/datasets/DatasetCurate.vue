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
                    <v-select
                        v-model="selectedWorkflow"
                        class='pr-5 pl-5 mt-4 mb-2'
                    ></v-select>
                </v-col>
            </v-row>

        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';

const curation = namespace( 'curation' );

@Component
export default class DatasetCurate extends Vue {
    @Prop() private dataset!: any;
    @Prop({type: String, default: ''}) private color!: string;
    @Prop({type: Boolean, default: false }) private dark!: boolean;
    @Prop({type: Boolean, default: false}) private collapsed!: boolean;
    private selectedWorkflow: string = '';

}
</script>

<style lang="scss">
</style>