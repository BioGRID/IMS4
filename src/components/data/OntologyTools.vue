<template>
    <div class='ontology-tools'>
            
        <v-container fluid class='pt-0'>
            <h3>Ontology Search</h3>
            <v-divider class='mb-3' />
            <v-row>
                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                    <v-text-field
                        v-model.trim="ontologySearchString"
                        solo
                        flat
                        outlined
                        style="border-radius: 0"
                    >

                        <template v-slot:append>
    
                            <v-btn
                                depressed 
                                tile
                                color="primary"
                                class="ma-0"
                                @click="findSearchItems">
                            
                                <v-icon>mdi-magnify</v-icon>
                                Search
                                
                            </v-btn>
            
                        </template>
      
                    </v-text-field>   
                   
                </v-col>
                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                    <v-select 
                        label="In Ontology"
                        :items="ontologyOptions"
                        v-model.trim="ontologyOption"
                        :menu-props="{ offsetY: true }"
                        attach
                        @change="changeOntology"
                    ></v-select>
                </v-col>
            </v-row>
            <v-row class='mt-n7'>
                <v-col cols="12" xl="8" lg="8" md="8" sm="12" xs="12">
                    <v-tabs
                        v-model="activeTab"
                        color="cyan"
                        dark
                        slider-color="yellow"
                    >
                        <v-tab key="1" ripple>
                            Popular
                        </v-tab>
                        <v-tab key="2" ripple>
                            Search
                        </v-tab>
                        <v-tab key="3" ripple>
                            Tree
                        </v-tab>
                        <v-tab-item key="1" class="tab-container">
                            <v-card flat>
                            <v-card-text>Contents for Item 1 go here</v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item  key="2" class="tab-container">
                            <v-card flat>
                            <v-card-text>
                                <h3>{{searchResultsCount}}</h3>
                                <v-list two-line>
                                    <template v-for="(searchResultsItem, index) in searchResultsItems">
                                        <v-subheader
                                            v-if="searchResultsItem.header"
                                            :key="searchResultsItem.header"
                                            v-text="searchResultsItem.header"
                                        ></v-subheader>
                                
                                        <v-divider
                                            v-else-if="searchResultsItem.divider"
                                            :key="index"
                                            :inset="searchResultsItem.inset"
                                        ></v-divider>
                                
                                        <v-list-item
                                            v-else
                                            :key="searchResultsItem.title"
                                            @click=""
                                        >
                                            <v-list-item-content>
                                                <v-list-item-title v-html="searchResultsItem.title"></v-list-item-title>
                                                <v-list-item-subtitle v-html="searchResultsItem.subtitle"></v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template>
                                </v-list>
                            </v-card-text>
                            </v-card>
                        </v-tab-item> 
                        <v-tab-item key="3" class="tab-container">
                            <v-card flat>
                                <v-card-text>            
                                    <v-treeview
                                        v-model="ontologyBrowseTree"
                                        :load-children="fetchItems"
                                        :items="items"
                                        hoverable
                                        selection-type="independent"
                                        dense
                                        selected-color="indigo"
                                        return-object
                                        expand-icon="mdi-chevron-down"
                                    >
                                        <template v-slot:prepend="{ item }">
                                            <v-icon v-if="!item.children" color="success">mdi-leaf</v-icon>
                                        </template>
                                        <template v-slot:label="{ item }">
                                            {{item.name}}
                                            <v-icon 
                                                @click="openTermDialog(item)"
                                                dark
                                                color="black"
                                            >
                                                mdi-information
                                            </v-icon>
                                        </template>
                                        <template v-slot:append="{ item }">
                                            <v-tooltip
                                                attach
                                                left
                                            >
                                                <template v-slot:activator="{ on }">
                                                    <v-btn 
                                                        class="ma-1"
                                                        fab 
                                                        dark 
                                                        x-small 
                                                        color="primary"
                                                        @click="addSelectedTerm(item)"
                                                        v-on="on"
                                                    >
                                                        <v-icon dark>mdi-plus</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Add Term - {{item.name}}</span>
                                            </v-tooltip>
                                            <v-tooltip
                                                attach
                                                left
                                            >
                                                <template v-slot:activator="{ on }">
                                                    <v-btn 
                                                        class="ma-1"
                                                        fab 
                                                        dark 
                                                        x-small 
                                                        color="primary"
                                                        @click="addSelectedQualifier(item)"
                                                        v-on="on"
                                                    >
                                                        <v-icon dark>mdi-folder-plus</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Add Qualifier, {{item.name}}, to checked term/s</span>
                                            </v-tooltip>
                                        </template>
                                    </v-treeview>  

                                    <v-dialog
                                        v-model="ontologyTermDialog"
                                        scrollable 
                                        max-width="700px"
                                    >
                                        <v-card
                                            v-model="selectedOntologyTermInfo"
                                        >
                                            <v-card-title>
                                                {{selectedOntologyTermInfo.name}}
                                            </v-card-title>
                                            <v-card-text style="max-height: 600px;">
                                                {{selectedOntologyTermInfo.definition}}
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-btn
                                                    color="primary"
                                                    text
                                                    @click="ontologyTermDialog = false"
                                                >
                                                Close
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog> 
                                </v-card-text>
                            </v-card>
                        </v-tab-item>   
                    </v-tabs>
                </v-col>
                <v-col cols="12" xl="4" lg="4" md="4" sm="12" xs="12">
                    <v-container fluid class='selected-items-container'>
                         <v-row>
                            <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                <h3>Selected Terms</h3>
                            </v-col>
                            <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                <v-menu
                                    attach
                                    nudge-bottom="40"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-btn class='float-right mt-n2' v-on="on" color="success">
                                            <v-icon>mdi-settings</v-icon>
                                            Tools
                                        </v-btn>
                                    </template>

                                    <v-list dense>
                                        <v-list-item
                                            v-for="(link, i) in selectedTermsMenuLinks"
                                            :key="i"
                                            :to="link.to"
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
                            </v-col>
                        </v-row>
                        <v-divider class='mb-3' />
                        <v-row no-gutters>
                            <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12">
                                <v-treeview
                                    v-model="selectedTermsTree"
                                    :items="selectedTerms"
                                    expand-icon="mdi-chevron-down"
                                    dense
                                    selectable
                                    selection-type="independent"
                                    hoverable
                                    return-object
                                >
                                    <template v-slot:append="{ selectedTerm }">
                                        <v-btn 
                                            @click="removeQualifier(selectedTerm)"
                                            color="success"
                                        >Remove</v-btn>
                                    </template>
                                </v-treeview>  
                            </v-col>
                        </v-row>
                    </v-container>
                </v-col>
            </v-row>
   
        </v-container>
        
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { ELASTIC_QUERY, ELASTIC_COUNT } from '@/models/elastic/Query';
import { buildSearchQuery, buildSortQuery } from '@/utils/ElasticSearchBuilder';
import { OntologyHash } from '@/models/annotation/Ontology';
import bodybuilder from 'bodybuilder';
import { syncDelay } from '@/utils/HelperUtils';
import { isStringInArrayOfObjects } from '@/utils/HelperUtils';

const annotation = namespace( 'annotation' );

@Component
export default class OntologyTools extends Vue {
    @Prop({type: String, default: ''}) private ontologyTreeTitle!: string;
    @annotation.State private ontologies!: OntologyHash[];
    private ontologyOption: OntologyHash[] = [];
    private isLoading: boolean = false;
    private ontologyBrowseTree: any[] = [];
    private items: any[] = [];
    private types: any[] = [];
    private ontologyID: number = 9;
    private ontologyTermDialog: boolean = false;
    private selectedOntologyTermInfo: any = {};
    private tabs: any = null;
    private activeTab: number = 0;
    private ontologySearchString: string = '';
    private searchResultsCount: string = 'Search for terms above to populate this list...';
    private searchResultsItems: any[] = [];
    private selectedTermsTree: any[] = [];
    private selectedTerms: any[] = [];
    private selectedTermsMenuLinks: object[] = [{
        to: '/admin/user/changemypassword',
        icon: 'mdi-lock-reset',
        text: 'Change Password',
    }, {
        to: '/pages/login',
        icon: 'mdi-logout',
        text: 'Logout',
    }];

    get ontologyOptions() {
        const ontologyOptions: object[] = [];
        for (const ontology of Object.values(this.ontologies)) {
            if (ontology.deprecated === 0) {
                ontologyOptions.push({
                    text: ontology.name,
                    value: ontology.id,
                });
           }
        }
        return ontologyOptions.sort( this.alphaOptionsSort );
    }

    private openTermDialog(item: any) {
        
        this.selectedOntologyTermInfo.name = item.name + ' ( ' + item.id + ')';
        this.selectedOntologyTermInfo.definition = item.definition;

        this.ontologyTermDialog = true;
    }

    private addSelectedTerm(item: any) {
        // make sure term is not already in the selectedTerms object
        if ( isStringInArrayOfObjects( item.id, this.selectedTerms, 'id', [] )) {
            this.selectedTerms.push( {id: item.id, name: item.name, children: []} );
        }
    }

    private addSelectedQualifier(item: any) {
        console.log( this.selectedTermsTree );
        for (const selectedTerm of Object.values(this.selectedTermsTree)) {
            selectedTerm.children.push({id: item.id, name: item.name, children: []});
        }
    }

    private searchOntology() {
        this.activeTab = 1;
        console.log( this.activeTab );
    }

    private changeOntology() {

        // empty out the tree and items for the next ontology
        this.ontologyBrowseTree = [];
        this.items = [];

        this.ontologyID = this.ontologies[this.ontologyOption].ontology_id;
        const children: any = [];

        this.items = [{
            id: 'BIOGRID_ROOT_NAME',
            name: this.ontologies[this.ontologyOption].name,
            children,
        }];

        this.fetchItems(this.items[0], true );
    }

    private async fetchItems( item: any, getRootTerm: boolean ) {

        console.log( 'ontology id: ' + this.ontologyID );

        let query = null;

        if ( getRootTerm ) {
            query = this.getBaseRootQuery();
        } else {
            query = this.getBaseItemQuery(item.id);
        }

        const count = await ELASTIC_COUNT( query.build(), 'ontology' );
        if (count !== 0) {

            query = query.size( count );
            const data = await ELASTIC_QUERY( query.build(), 'ontology', false );
            if (data !== undefined && data.hits.total.value > 0) {
                let hit: any;
                for (hit of data.hits.hits) {
                    if ( hit._source.child_count === 0 ) {
                        item.children.push({id: hit._id, name: hit._source.name, definition: hit._source.definition });
                    } else {
                        item.children.push({id: hit._id, name: hit._source.name, definition: hit._source.definition, children: []});
                    }
                }
            }
        }

    }

    private async findSearchItems( ) {

        this.searchResultsCount = 'Performing query ....';

        this.searchResultsItems = [];
        this.activeTab = 1;

        let query =  this.getBaseSearchQuery(this.ontologySearchString);

        const count = await ELASTIC_COUNT( query.build(), 'ontology' );
        if ( count > 200 ) {
            this.searchResultsCount = 'Your search query resulted in ' + count + ' results. Please consider refining your search to narrow down the number of hits. For exact searches put double quotes around the search term "Query String".';
        } else if (count !== 0) {
            query = query.size( count );
            const data = await ELASTIC_QUERY( query.build(), 'ontology', false );
            if (data !== undefined && data.hits.total.value > 0) {
                let hit: any;
                for (hit of data.hits.hits) {
                    this.searchResultsItems.push({title: hit._id, subtitle: hit._source.name});
                }
                console.log( data.hits.hits );
                this.searchResultsCount = count + ' Matching Searched Terms Displayed';
            }

        } else {
            this.searchResultsCount = 'Your search query returned no results. Are you sure you selected the correct ontology to search via the dropdown list?';
        }

    }

    private getBaseSearchQuery(searchTerm: string) {
        return bodybuilder()
            .filter( 'term', 'ontology.ontology_id', this.ontologyID )
            .query( 'query_string', {
                query: searchTerm,
                fields: ['ontology_term_id', 'name'],
            });
    }

    private getBaseItemQuery(itemID: string) {
        return bodybuilder()
            .filter( 'term', 'ontology.ontology_id', this.ontologyID )
            .filter( 'term', 'parent_terms', itemID );
    }

    private getBaseRootQuery() {
        return bodybuilder()
            .filter( 'term', 'ontology.ontology_id', this.ontologyID )
            .filter( 'term', 'is_root', true );
    }

    private alphaOptionsSort( a: any, b: any ) {
        if (a.text > b.text) {
            return 1;
        } else if (a.text < b.text) {
            return -1;
        }
        return 0;
    }


}
</script>

<style lang="scss">
.v-input__append-outer {
    margin: 0 !important
}
.ontology-tools {
    padding: 15px 0px 0px 10px;
    border-style: solid;
    border-width: 1px;
    border-color: grey;
    background-color: lightgrey;
}
.selected-items-container {
    padding: 15px 0px 0px 10px;
    border-style: solid;
    border-width: 1px;
    border-color: grey;
    background-color: white;
}
.tab-container {
    max-height: 500px;
    overflow-y: auto;
    overflow-x: auto;
}
.custom-tool-tip {
    background-color: white;
    border-style: solid;
    color: black;
}
.v-tooltip__content {
  pointer-events: initial;
}
</style>