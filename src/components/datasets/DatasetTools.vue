<template>
    <div class='dataset-tools-card'>
        <v-sheet class='pa-1' :color='stateColor'>
            <v-app-bar dense color='white'>
                <v-btn 
                    v-for="(link,i) in datasetTools"
                    :key="i"
                    :href="link.to"
                    target="_BLANK"
                    color="grey lighten-2"
                    class='mr-2'
                    small
                    :title="link.text"
                >
                    {{ link.text }} <v-icon :color="link.color">{{ link.icon }}</v-icon>
                </v-btn>
                <v-divider vertical class='mx-2'></v-divider>           
                <v-menu
                    left
                    bottom
                    dark
                    nudge-bottom="3"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" color="grey lighten-2" small class='ml-2 mr-2'>
                        Open @ MOD <v-icon color="orange darken-3" class='ml-1'>mdi-gesture-tap-box</v-icon>
                        </v-btn>
                    </template>

                    <v-list dense>
                        <v-list-item
                            v-for="(link, i) in MODLinks"
                            :key="i"
                            :href="link.to"
                            target="_BLANK"
                        >
                            <v-list-item-content>
                                <v-list-item-title v-text="link.text" /> 
                            </v-list-item-content>
                            <v-list-item-icon>
                                <v-icon v-text="link.icon"></v-icon>
                            </v-list-item-icon>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <v-divider vertical class='mx-2'></v-divider>
                <v-sheet :color="stateColor" class='pa-2 ml-1'>
                    <h4>TEST</h4>
                </v-sheet>
            </v-app-bar>
        </v-sheet>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { HistoryEntry } from '@/models/curation/History';

const curation = namespace( 'curation' );

interface ModLinkout {
    to: string;
    text: string;
}

interface ToolLinkout {
    to: string;
    icon: string;
    text: string;
    color: string;
}

@Component
export default class DatasetDetails extends Vue {
    @curation.State private datasetCurationOptions!: any;
    @Prop() private dataset!: any;
    @Prop() private history!: HistoryEntry[];
    @Prop({type: String, default: ''}) private color!: string;
    @Prop({type: Boolean, default: false }) private dark!: boolean;
    private datasetTools: ToolLinkout[] = [];
    private datasetCollapsed: boolean = false;
    private baseMODLinkouts: ModLinkout[] = [
        {
            to: 'https://www.yeastgenome.org/reference/' ,
            text: 'SGD',
        },
        {
            to: 'http://www.informatics.jax.org/reference/',
            text: 'MGI',
        },
        {
            to: 'https://www.pombase.org/reference/PMID:',
            text: 'POMBASE',
        },
    ];

    private created() {
        this.generateToolLinks();
    }

    get MODLinks() {
        const modLinks = [];
        for (const link of this.baseMODLinkouts) {
            link.to = link.to + this.dataset.source_id;
            modLinks.push(link);
        }
        return modLinks;
    }

    get stateColor() {
        return 'red lighten-3';
    }

    private generateToolLinks() {
        this.generatePubmedLink();
        this.generatePMCLink();
        this.generateDOILink();
    }

    private generatePubmedLink() {
        if (this.dataset.source_type === 'pubmed') {
            this.datasetTools.push({
                to: 'https://www.ncbi.nlm.nih.gov/pubmed/?term=' + this.dataset.source_id,
                icon: 'mdi-file-document-box-multiple',
                text: 'View in Pubmed',
                color: 'blue',
            });
        }
    }

    private generatePMCLink() {
        if (this.dataset.pmc_id !== '') {
            this.datasetTools.push({
                to: 'https://www.ncbi.nlm.nih.gov/pmc/articles/' + this.dataset.pmc_id,
                icon: 'mdi-file-powerpoint',
                text: 'View in PMC',
                color: 'green',
            });
        }
    }

    private generateDOILink() {
        if (this.dataset.doi !== '') {
            this.datasetTools.push({
                to: 'https://doi.org/' + this.dataset.doi,
                icon: 'mdi-file-document-box-plus',
                text: 'View Source Article',
                color: 'red',
            });
        }
    }
}
</script>

<style lang="scss">
.v-card {
    overflow-wrap: normal !important;
}
</style>