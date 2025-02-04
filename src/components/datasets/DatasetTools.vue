<template>
    <div class='dataset-tools-card'>
        <v-sheet class='pa-1' :color='datasetStateColor'>
            <v-app-bar dense color='white'>
                <v-btn 
                    v-for="(link,i) in datasetTools"
                    :key="i"
                    :href="link.to"
                    target="_BLANK"
                    color="grey lighten-2"
                    class='mr-2'
                    small
                    :title="link.title"
                >
                    {{ link.text }} <v-icon :color="link.color">{{ link.icon }}</v-icon>
                </v-btn>
                <v-divider vertical class='mx-2'></v-divider>           
                <v-menu
                    left
                    bottom
                    dark
                    nudge-bottom="33"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            v-on="on" 
                            color="grey lighten-2" 
                            small 
                            class='ml-2 mr-2'
                            title='View in Model Organism Database'
                        >
                            View @ MOD <v-icon color="orange darken-3" class='ml-1'>mdi-gesture-tap-box</v-icon>
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
                <v-menu
                    left
                    bottom
                    dark
                    nudge-bottom="33"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn 
                            v-on="on" 
                            :color="datasetStateColor" 
                            small 
                            dark
                            class='ml-2 mr-2'
                            title='Change Dataset State'
                        >
                            State: {{ datasetStateName }} <v-icon class='ml-1'>{{ datasetStateIcon }}</v-icon>
                        </v-btn>
                    </template>

                    <v-list dense>
                        <v-list-item
                            v-for="(option, i) in datasetCurationOptions"
                            :key="i"
                            v-if="option.value !== 'ACCESSED'"
                            @click="changeDatasetState( option.value )"
                            target="_BLANK"
                        >
                            <v-list-item-content>
                                <v-list-item-title v-text="option.text" /> 
                            </v-list-item-content>
                            <v-list-item-icon>
                                <v-icon v-text="option.icon"></v-icon>
                            </v-list-item-icon>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <v-divider vertical class='mx-2'></v-divider>
                <v-dialog persistent max-width="290" v-model="closeDialog">
                    <template v-slot:activator="{ on }">
                        <v-btn
                            v-on="on"
                            class='mr-2 ml-2'
                            small
                            dark
                            title="Remove dataset from set of open datasets"
                            color="red darken-3"
                        >
                            Close Dataset <v-icon class='ml-1'>mdi-close-box</v-icon>
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title class="headline">Close this Dataset?</v-card-title>
                        <v-card-text>You are about to close this dataset. This will remove the dataset from your list of open datasets, but will not change the state of the dataset. If you have any unfinished work for this dataset, it will be lost when closed. Are you sure you want to close the dataset?</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="red darken-3" dark @click="closeDialog = false">Disagree <v-icon class='ml-1'>mdi-close-box</v-icon></v-btn>
                            <v-btn color="green darken-3" dark @click="closeDialog = false; closeDataset();">Agree <v-icon class='ml-1'>mdi-check</v-icon></v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
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
    title: string;
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
    private closeDialog: boolean = false;
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

    get datasetStateColor() {
        for (const historyEntry of this.history) {
            if (historyEntry.method !== 'ACCESSED' ) {
                return this.datasetCurationOptions[historyEntry.method].color;
            }
        }
        return 'grey darken-3';
    }

    get datasetStateName() {
        for (const historyEntry of this.history) {
            if (historyEntry.method !== 'ACCESSED' ) {
                return this.datasetCurationOptions[historyEntry.method].text;
            }
        }
        return 'New';
    }

    get datasetStateIcon() {
        for (const historyEntry of this.history) {
            if (historyEntry.method !== 'ACCESSED' ) {
                return this.datasetCurationOptions[historyEntry.method].icon;
            }
        }
        return 'mdi-check';
    }

    private changeDatasetState( datasetState: string ) {
        console.log( datasetState );
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
                text: 'Pubmed',
                title: 'View @ Pubmed',
                color: 'blue',
            });
        }
    }

    private generatePMCLink() {
        if (this.dataset.pmc_id !== '') {
            this.datasetTools.push({
                to: 'https://www.ncbi.nlm.nih.gov/pmc/articles/' + this.dataset.pmc_id,
                icon: 'mdi-file-powerpoint',
                text: 'PMC',
                title: 'View @ Pubmed Central',
                color: 'green',
            });
        }
    }

    private generateDOILink() {
        if (this.dataset.doi !== '') {
            this.datasetTools.push({
                to: 'https://doi.org/' + this.dataset.doi,
                icon: 'mdi-file-document-box-plus',
                text: 'DOI',
                title: 'View Source Article (via DOI)',
                color: 'red',
            });
        }
    }

    private closeDataset() {
        this.$emit( 'closeDataset' );
    }

}
</script>

<style lang="scss">
.v-card {
    overflow-wrap: normal !important;
}
</style>