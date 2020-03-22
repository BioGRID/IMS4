<template>
    <div class='ontology-tools'>
        <v-treeview
            v-model="tree"
            :load-children="fetchItems"
            :items="items"
            selected-color="indigo"
            return-object
            expand-icon="mdi-chevron-down"
            on-icon="mdi-bookmark"
            off-icon="mdi-bookmark-outline"
            indeterminate-icon="mdi-bookmark-minus"
        >
            <template v-slot:prepend="{ item }">
                <v-icon v-if="!item.children">mdi-account</v-icon>
            </template>
        </v-treeview>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { ELASTIC_QUERY, ELASTIC_COUNT } from '@/models/elastic/Query';
import { buildSearchQuery, buildSortQuery } from '@/utils/ElasticSearchBuilder';
import bodybuilder from 'bodybuilder';
import { syncDelay } from '@/utils/HelperUtils';

@Component
export default class OntologyTools extends Vue {
    @Prop({type: String, default: ''}) private ontologyTreeTitle!: string;
    private breweries: any[] = [];
    private isLoading: boolean = false;
    private tree: any[] = [];
    private items: any[] = [];
    private types: any[] = [];
    private ontologyID: number = 9;

    private created() {

        console.log( 'ITEMS' );

        const children: any = [];

        this.items = [{
            id: 'CL:0000000',
            name: 'Cell Ontology',
            children,
        }];

    }

    private async fetchItems( item: any ) {

        return new Promise((resolve, reject) => {

            console.log( 'FETCHING' );
            console.log( item );
            console.log( item.id );

            let query = this.getBaseQuery(item.id);
            // query = query.size( this.getTotalCount(item.id) );
            query = query.size( 10000 );

            ELASTIC_QUERY( query.build(), 'ontology', false, (data: any) => {
                if (data.hits.total.value > 0 ) {
                    let hit: any;
                    for (hit of data.hits.hits) {
                        console.log( hit );
                        if ( hit._source.child_count === 0 ) {
                            item.children.push({id: hit._id, name: hit._source.name});
                        } else {
                            item.children.push({id: hit._id, name: hit._source.name, children: []});
                        }
                    }
                    resolve();
                }
            }, (error: any) => {
                console.log(error);
            });

        });

        console.log('finished');

    }

    private getBaseQuery(itemID: string) {
        return bodybuilder()
            .filter( 'term', 'ontology.ontology_id', this.ontologyID )
            .filter( 'term', 'parent_terms', itemID );
    }

    private getTotalCount(itemID: string) {
        const query = this.getBaseQuery(itemID);
        ELASTIC_COUNT( query.build(), 'ontology', false, (data: any) => {
            console.log( data.count );
            return data.count;
        }, (error: any) => {
            console.log(error);
        });
        return -1;
    }


}
</script>

<style lang="scss">
</style>