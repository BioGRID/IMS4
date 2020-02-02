<template>
    <div class='dataset-tools-card'>
        <v-card 
            tile
            :color="color"
            :dark="dark"
        >
            <div class="overline pl-5 pt-5">Dataset Tools</div>
            <v-list dense class='pb-5'>
                <v-list-item
                    v-for="(link, i) in datasetTools"
                    :key="i"
                    :href="link.to"
                    target="_BLANK"
                    active-class="secondary black--text"
                >
                    <v-list-item-action>
                        <v-icon :color="link.color">{{ link.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content class="ml-n5">
                        <v-list-item-title v-text="link.text" /> 
                        <v-list-item-subtitle v-text="link.subtitle" />
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';

const curation = namespace( 'curation' );

@Component
export default class DatasetDetails extends Vue {
    @curation.State private currentDataset!: any;
    @curation.State private datasetCollapsed!: any;
    @Prop({type: String, default: ''}) private color!: string;
    @Prop({type: Boolean, default: false }) private dark!: boolean;
    private datasetTools: object[] = [];

    private created() {
        this.generateToolLinks();
    }

    private generateToolLinks() {
        this.generatePubmedLink();
        this.generatePMCLink();
        this.generateDOILink();
    }

    private generatePubmedLink() {
        if (this.currentDataset.source_type === 'pubmed') {
            this.datasetTools.push({
                to: 'https://www.ncbi.nlm.nih.gov/pubmed/?term=' + this.currentDataset.source_id,
                icon: 'mdi-file-document-box-multiple',
                text: 'View in Pubmed',
                color: 'blue',
            });
        }
    }

    private generatePMCLink() {
        if (this.currentDataset.pmc_id !== '') {
            this.datasetTools.push({
                to: 'https://www.ncbi.nlm.nih.gov/pmc/articles/' + this.currentDataset.pmc_id,
                icon: 'mdi-file-powerpoint',
                text: 'View in PMC',
                color: 'green',
            });
        }
    }

    private generateDOILink() {
        if (this.currentDataset.doi !== '') {
            this.datasetTools.push({
                to: 'https://doi.org/' + this.currentDataset.doi,
                icon: 'mdi-file-document-box-plus',
                text: 'View Source Article',
                color: 'red',
            });
        }
    }
}
</script>

<style lang="scss">
</style>