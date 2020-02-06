<template>
    <div class='dataset-details-card'>
        <v-card 
            tile
            class='pa-5'
            :color="color"
            :dark="dark"
        >
            
            <v-icon color='orange darken-2' @click='toggleDatasetCollapsed()' title='Click to show/hide dataset details' class='float-right'>mdi-arrow-split-horizontal</v-icon>

            <div class="overline">BioGRID Dataset ({{ currentDataset.dataset_id }})</div>
            <div class='headline font-weight-bold'> 
                {{ currentDataset.title }} 
            </div>
            <p class='body-2 mb-0 font-weight-regular'>
                {{ journal }} {{ pubDate }} {{ pageDetails }} <span v-html="doi"></span> <span v-html="pmid"></span>
            </p>
            <p class='pt-3 subtitle-1 font-weight-medium' v-if="this.showAuthors && !this.datasetCollapsed">
                {{ datasetAuthors() }}
            </p>
            <p class='body-1' v-if="!this.datasetCollapsed">
                {{ currentDataset.abstract }}
            </p>

            <p class='subtitle-2 font-weight-medium mb-0' v-if="this.showKeywords && !this.datasetCollapsed">
                <strong>Keywords: </strong> {{ keywords() }}
            </p>

            <p class='subtitle-2 font-weight-medium mb-0' v-if="this.showMeshTerms && !this.datasetCollapsed">
                <strong>Mesh Terms: </strong> {{ meshTerms() }}
            </p>

            

            <v-alert 
                type="error" 
                dense
                class='mt-5 mr-n5 ml-n5 mb-n5'
                v-if="this.currentDataset.state !== 'active'"
            >
                Dataset State: {{ currentDataset.state }}
            </v-alert>

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
    private showAuthors: boolean = true;
    private showKeywords: boolean = true;
    private showMeshTerms: boolean = true;

    private datasetAuthors() {
        if (this.currentDataset.authors.length > 0) {
            return this.currentDataset.authors.join( ', ' );
        } else if (this.currentDataset.collectives.length > 0) {
            return this.currentDataset.collectives.join( ', ' );
        }
        this.showAuthors = false;
    }

    private keywords() {
        if (this.currentDataset.keywords.length > 0) {
            return this.currentDataset.keywords.join( ', ' );
        }
        this.showKeywords = false;
    }

    private meshTerms() {
        if (this.currentDataset.mesh_terms.length > 0) {
            return this.currentDataset.mesh_terms.join( ', ' );
        }
        this.showMeshTerms = false;
    }

    get journal() {
        if (this.currentDataset.journal_abbreviation !== '') {
            return this.currentDataset.journal_abbreviation + ' | ';
        }
        return '';
    }

    get pubDate() {
        if (this.currentDataset.pub_date !== '') {
            return this.currentDataset.pub_date + ' | ';
        }
        return '';
    }

    get pageDetails() {
        let pageDetails = '';
        if (this.currentDataset.volume !== '') {
            if (this.currentDataset.issue !== '') {
                if (this.currentDataset.pagination !== '' ) {
                    pageDetails = 'vol:' + this.currentDataset.volume + ', iss:' + this.currentDataset.issue + ', pg:' + this.currentDataset.pagination;
                } else {
                    pageDetails = 'vol:' + this.currentDataset.volume + ', iss:' + this.currentDataset.issue;
                }
            } else {
                pageDetails = 'vol:' + this.currentDataset.volume;
            }
        } else if (this.currentDataset.issue !== '') {
            if (this.currentDataset.pagination !== '' ) {
                pageDetails = 'iss:' + this.currentDataset.issue + ', pg:' + this.currentDataset.pagination;
            } else {
                pageDetails = 'iss:' + this.currentDataset.issue;
            }
        } else if (this.currentDataset.pagination !== '') {
            pageDetails = 'pg:' + this.currentDataset.pagination;
        }
        return pageDetails + ' | ';
    }

    get doi() {
        if (this.currentDataset.doi !== '') {
            return 'doi: <a class="plainLink" href="https://doi.org/' + this.currentDataset.doi + '" target="_BLANK">' + this.currentDataset.doi + '</a> | ';
        }
        return '';
    }

    get pmid() {
        if (this.currentDataset.source_type === 'pubmed') {
            return 'pmid: <a class="plainLink" href="https://www.ncbi.nlm.nih.gov/pubmed/?term=' + this.currentDataset.source_id + '" target="_BLANK">' + this.currentDataset.source_id + '</a>';
        }
        return '';
    }

    private toggleDatasetCollapsed() {
         this.$store.dispatch( 'curation/toggleDatasetCollapsed' );
    }

}
</script>

<style lang="scss">
</style>