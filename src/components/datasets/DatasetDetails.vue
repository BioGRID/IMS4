<template>
    <div class='dataset-details-card'>
        <v-card 
            shaped
            class='pa-5'
            :color="color"
            :dark="dark"
        >
            <v-alert 
                type="error" 
                dense
                v-if="this.currentDataset.state !== 'active'"
            >
                Dataset State: {{ currentDataset.state }}
            </v-alert>

            <div class="overline">BioGRID Dataset ({{ currentDataset.dataset_id }})</div>
            <div
                class='headline font-weight-bold'
            > 
                {{ currentDataset.title }} 
            </div>
            <p class='pt-3 subtitle-1 font-weight-medium' v-if="this.showAuthors">
                {{ datasetAuthors() }}
            </p>
            <p class='body-1'>
                {{ currentDataset.abstract }}
            </p>

            <p class='subtitle-2 font-weight-medium mb-0' v-if="this.showKeywords">
                <strong>Keywords: </strong> {{ keywords() }}
            </p>

            <p class='subtitle-2 font-weight-medium mb-0' v-if="this.showMeshTerms">
                <strong>Mesh Terms: </strong> {{ meshTerms() }}
            </p>

            <p class='body-2 mt-5 mb-0 font-weight-regular'>
                {{ citation() }}
            </p>

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

    private citation() {
        const citation = [];
        if (this.currentDataset.journal_abbreviation !== '') {
            citation.push( this.currentDataset.journal_abbreviation );
        }

        if (this.currentDataset.pub_date !== '') {
            citation.push(this.currentDataset.pub_date);
        }

        if (this.currentDataset.volume !== '') {
            if (this.currentDataset.issue !== '') {
                if (this.currentDataset.pagination !== '' ) {
                    citation.push( this.currentDataset.volume + '(' + this.currentDataset.issue + ');' + this.currentDataset.pagination + '.' );
                } else {
                    citation.push( this.currentDataset.volume + '(' + this.currentDataset.issue + ');' );
                }
            } else {
                citation.push( this.currentDataset.volume + ';' );
            }
        } else if (this.currentDataset.issue !== '') {
            if (this.currentDataset.pagination !== '' ) {
                citation.push( this.currentDataset.issue + ';' + this.currentDataset.pagination + '.' );
            } else {
                citation.push( this.currentDataset.issue + ';' );
            }
        } else if (this.currentDataset.pagination !== '') {
            citation.push( this.currentDataset.pagination + '.' );
        }

        if (this.currentDataset.doi !== '') {
            citation.push( this.currentDataset.doi );
        }

        if (this.currentDataset.source_type === 'pubmed') {
            citation.push( '[PMID: ' + this.currentDataset.source_id + ']');
        }

        return citation.join( ', ' );

    }

}
</script>

<style lang="scss">
</style>