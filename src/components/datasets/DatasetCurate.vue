<template>
    <div class='datasetcurate'>
        <v-card 
            tile
            class='pa-5'
            :color="color"
            :dark="dark"
        >
            <div class='headline font-weight-bold'> 
                Curate New Data
            </div>
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
}
</script>

<style lang="scss">
</style>