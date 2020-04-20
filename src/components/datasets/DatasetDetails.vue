<template>
    <div class='dataset-details-card'>
        <v-card 
            tile
            class='pa-5'
            :color="color"
            :dark="dark"
        >
            
            <v-icon color='orange darken-2' @click='toggleDatasetCollapsed()' title='Click to show/hide dataset details' class='float-right'>mdi-arrow-split-horizontal</v-icon>

            <div class="overline">BioGRID Dataset ({{ dataset.dataset_id }})</div>
            <div class='headline font-weight-bold'> 
                {{ dataset.title }} 
            </div>
            <p class='body-2 mb-0 font-weight-regular'>
                {{ journal }} {{ pubDate }} {{ pageDetails }} <span v-html="doi"></span> <span v-html="pmid"></span>
            </p>
            <p class='pt-3 subtitle-1 font-weight-medium' v-if="this.showAuthors && !this.datasetCollapsed">
                {{ datasetAuthors() }}
            </p>
            <p class='body-1' v-if="!this.datasetCollapsed">
                {{ dataset.abstract }}
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
                v-if="this.dataset.state !== 'active'"
            >
                Dataset State: {{ dataset.state }}
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
    @Prop() private dataset!: any;
    @Prop({type: String, default: ''}) private color!: string;
    @Prop({type: Boolean, default: false }) private dark!: boolean;
    @Prop({type: Boolean, default: false}) private collapsed!: boolean;
    private showAuthors: boolean = true;
    private showKeywords: boolean = true;
    private showMeshTerms: boolean = true;
    private datasetCollapsed: boolean = false;

    private created() {
        this.datasetCollapsed = this.collapsed;
    }

    private datasetAuthors() {
        if (this.dataset.authors.length > 0) {
            return this.dataset.authors.join( ', ' );
        } else if (this.dataset.collectives.length > 0) {
            return this.dataset.collectives.join( ', ' );
        }
        this.showAuthors = false;
    }

    private keywords() {
        if (this.dataset.keywords.length > 0) {
            return this.dataset.keywords.join( ', ' );
        }
        this.showKeywords = false;
    }

    private meshTerms() {
        if (this.dataset.mesh_terms.length > 0) {
            return this.dataset.mesh_terms.join( ', ' );
        }
        this.showMeshTerms = false;
    }

    get journal() {
        if (this.dataset.journal_abbreviation !== '') {
            return this.dataset.journal_abbreviation + ' | ';
        }
        return '';
    }

    get pubDate() {
        if (this.dataset.pub_date !== '') {
            return this.dataset.pub_date + ' | ';
        }
        return '';
    }

    get pageDetails() {
        let pageDetails = '';
        if (this.dataset.volume !== '') {
            if (this.dataset.issue !== '') {
                if (this.dataset.pagination !== '' ) {
                    pageDetails = 'vol:' + this.dataset.volume + ', iss:' + this.dataset.issue + ', pg:' + this.dataset.pagination;
                } else {
                    pageDetails = 'vol:' + this.dataset.volume + ', iss:' + this.dataset.issue;
                }
            } else {
                pageDetails = 'vol:' + this.dataset.volume;
            }
        } else if (this.dataset.issue !== '') {
            if (this.dataset.pagination !== '' ) {
                pageDetails = 'iss:' + this.dataset.issue + ', pg:' + this.dataset.pagination;
            } else {
                pageDetails = 'iss:' + this.dataset.issue;
            }
        } else if (this.dataset.pagination !== '') {
            pageDetails = 'pg:' + this.dataset.pagination;
        }
        return pageDetails + ' | ';
    }

    get doi() {
        if (this.dataset.doi !== '') {
            return 'doi: <a class="plainLink" href="https://doi.org/' + this.dataset.doi + '" target="_BLANK">' + this.dataset.doi + '</a> | ';
        }
        return '';
    }

    get pmid() {
        if (this.dataset.source_type === 'pubmed') {
            return 'pmid: <a class="plainLink" href="https://www.ncbi.nlm.nih.gov/pubmed/?term=' + this.dataset.source_id + '" target="_BLANK">' + this.dataset.source_id + '</a>';
        }
        return '';
    }

    private toggleDatasetCollapsed() {
        this.datasetCollapsed = !this.datasetCollapsed;
    }

}
</script>

<style lang="scss">
</style>