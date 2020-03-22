<template>
    <div class='ontology-tools'>
        <v-treeview
              v-model="tree"
              :load-children="fetch"
              :items="items"
              selected-color="indigo"
              open-on-click
              selectable
              return-object
              expand-icon="mdi-chevron-down"
              on-icon="mdi-bookmark"
              off-icon="mdi-bookmark-outline"
              indeterminate-icon="mdi-bookmark-minus"
            >
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

    private created() {

        console.log( 'ITEMS' );

        const children: any = [];

        this.items = [{
            id: 1,
            name: 'All Breweries',
            children,
        }];

    }

    private fetch( item: any ) {

        console.log( 'FETCHING' );
        console.log( item );

        item.children = [
            { id: 2, name: 'Calendar : app', children: [] },
            { id: 3, name: 'Chrome : app' },
            { id: 4, name: 'Webstorm : app' },
        ];

    }


}
</script>

<style lang="scss">
</style>