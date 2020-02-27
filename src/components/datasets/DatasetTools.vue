<template>
    <div class='dataset-tools-card'>
        <v-card 
            tile
            :color="color"
            :dark="dark"
        >
            <div class="overline pl-3 pt-5">Dataset Tools</div>
            <v-list dense class='pb-0 pt-0'>
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
            <template v-if="this.currentDataset.source_type === 'pubmed'">
                <v-divider />
                <div class="overline pl-3 pt-2">Open @ MOD</div>
                <div class='pl-5 pr-5 pb-2'>
                    <span 
                        v-for="(link,i) in MODLinks"
                        :key="i"
                        class='text-left'
                    >
                        <a :href="link.to" target="_BLANK" class='plainLink body-2 pr-1 font-weight-bold' :title='"View in " + link.text'>{{ link.text }}</a>
                    </span> 
                </div> 
            </template>
            <v-divider />
            <div class="overline pl-3 pt-2">Curation Status</div>
            <div class='pl-5 pr-5 pb-2'></div>
        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';

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
    @curation.State private currentDataset!: any;
    @curation.State private datasetCollapsed!: any;
    @Prop({type: String, default: ''}) private color!: string;
    @Prop({type: Boolean, default: false }) private dark!: boolean;
    private datasetTools: ToolLinkout[] = [];
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
            link.to = link.to + this.currentDataset.source_id;
            modLinks.push(link);
        }
        return modLinks;
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
.v-card {
    overflow-wrap: normal !important;
}
</style>