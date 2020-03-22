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

@Component
export default class OntologyTools extends Vue {
    @Prop({type: String, default: ''}) private ontologyTreeTitle!: string;
    private breweries: any[] = [];
    private isLoading: boolean = false;
    private tree: any[] = [];
    private types: any[] = [];


    get items() {

      const children = this.types.map((type) => ({
        id: type,
        name: this.getName(type),
        children: this.getChildren(type),
      }));

      return [{
        id: 1,
        name: 'All Breweries',
        children,
      }];

    }

    get shouldShowTree() {
      return this.breweries.length > 0 && !this.isLoading;
    }

    @Watch( 'breweries' )
    private onBreweriesChange() {

        this.types = this.breweries.reduce((acc, cur) => {
            const type = cur.brewery_type;
            if (!acc.includes(type)) {
                acc.push(type);
            }
            return acc;
        }, []).sort();
    }

    private fetch() {

        if (this.breweries.length) {
            return;
        }

        fetch('https://api.openbrewerydb.org/breweries')
            .then((res) => res.json())
            .then((data) => (this.breweries = data))
            .catch((err) => console.log(err));

    }

    private getChildren( type: any ) {
      const breweries = [];

      for (const brewery of this.breweries) {
        if (brewery.brewery_type !== type) {
            continue;
        }

        breweries.push({
          ...brewery,
          name: this.getName(brewery.name),
        });
      }

      return breweries.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });

    }

    private getName( name: any ) {
      return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    }

}
</script>

<style lang="scss">
</style>