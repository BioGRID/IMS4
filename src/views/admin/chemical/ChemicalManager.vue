<template>
    <div id="chemical-manager">
        <v-container fluid class='pt-0'>
            <v-btn 
                class='float-right mt-4'
                small
                color='primary'
                to='/elements/admin'
                dark
            >
                < Back
            </v-btn>
            
            <h1>Chemical Manager</h1>
            
            <div class="subtitle-1">Search for existing chemicals in the BioGRID or add new chemicals.</div>

            <v-btn 
                class='mt-4'
                small
                color='green darken-2'
                to='/admin/chemical/chemicaladd'
                dark
                :ripple="true"
            >
                Add New Chemical 
                <v-icon class='ml-2'>mdi-account-plus</v-icon>
            </v-btn>
             
            
            <v-text-field 
                label="Chemical Search"
                :error-messages="chemicalSearchErrors"
                light
                required
                dense
                solo
                append-icon="mdi-magnify"
                v-model.trim="chemicalSearchQuery"
                title="Search for Chemicals by name or id (example: pubmed)"
                @click:append="submitChemicalSearch"
                @input="$v.chemicalSearchQuery.$touch()"
                @blur="$v.chemicalSearchQuery.$touch()"
            />
        
            <ACEDataTable
                class='mt-5'
                title="Chemicals"
                tableClass="pa-1"
                :columns="chemicalTableHeaders"
                :rows="chemicalList"
                :rowsPerPage="100"
                :totalRows="chemicalCount"
                :pagination="true"
                :showSearch="true"
            >
                <template slot-scope="{ row }">
                    <td class='text-left' nowrap>{{ row.chemical_id }}</td>
                    <td class='text-left' nowrap>{{ row.name }}</td>
                    <td class='text-left' wrap>{{ row.description }}</td>
                    <td class='text-left' nowrap>{{ row.chemical_type }}</td>
                    <td class='text-left' nowrap>{{ row.source }}</td>
                    <td class='text-left' nowrap>{{ row.source_id }}</td>
                    <td class='nowrap text-center'>
                        <v-btn 
                            x-small 
                            dark 
                            fab 
                            elevation="0" 
                            color="info" 
                            :title='"Edit chemical: " + row.name' 
                            :to="'/admin/chemical/chemicaledit/' + row.chemical_id"
                        >
                            <v-icon>mdi-account-edit</v-icon>
                        </v-btn>
                    </td>   
                </template>

            </ACEDataTable>
            
            <div v-if="retrievingChemicalString">Retrieving chemicals.</div>

        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { required, numeric } from 'vuelidate/lib/validators';
import { generateValidationError } from '@/utils/ValidationErrors';
import Vuelidate from 'vuelidate';
import { ChemicalEntry, API_CHEMICAL_FETCH, API_CHEMICAL_FETCH_ALL } from '@/models/annotation/Chemical';
import axios from 'axios';
import store from '@/store/store';
import ACEDataTable from '@/components/data/ACEDataTable.vue';

@Component({
    components: {
        ACEDataTable,
    },
})
export default class ChemicalManager extends Vue {
    private chemicalSearchQuery: number = 301;
    private retrievingChemicalString: boolean = true;
    private chemicalName: string = '';
    private chemicalList: object[] = [];
    private chemicalTableHeaders: object[] = [
         {
            title: 'ID',
            field: 'chemical_id',
            sortable: true,
            searchable: true,
            searchType: 'NumericRange',
            searchName: 'ID',
            sortDirection: '',
            sortOrder: 0,
            className: 'text-center',
        },
        {
            title: 'Name',
            field: 'name',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Name',
            sortDirection: 'asc',
            sortOrder: 1,
            className: 'text-left',
        },
        {
            title: 'Description',
            field: 'description',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Description',
            sortDirection: '',
            sortOrder: 0,
            className: 'text-left',
        },
        {
            title: 'Chemical Type',
            field: 'chemical_type',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Chemical Type',
            sortDirection: '',
            sortOrder: 0,
            className: 'text-left',
        },
        {
            title: 'Source',
            field: 'source',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Source',
            sortDirection: '',
            sortOrder: 0,
            className: 'text-left',
        },
        {
            title: 'Source ID',
            field: 'source_id',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Source ID',
            sortDirection: '',
            sortOrder: 0,
            className: 'text-left',
        },
        {
            title: 'Tools',
            field: 'tools',
            sortable: false,
            searchable: false,
            searchType: '',
            searchName: 'Tools',
            sortDirection: '',
            sortOrder: 0,
            className: 'nowrap text-center',
        },
    ];

    private created() {
        this.generateChemicalList();
    }

    private generateChemicalList() {
        const user = store.getters['auth/getUser'];
        API_CHEMICAL_FETCH_ALL( (data: any) =>  {
            for (const chemical of data) {
                this.chemicalList.push({
                    chemical_id: chemical.chemical_id,
                    name: chemical.name,
                    description: chemical.description,
                    chemical_type: chemical.chemical_type,
                    source: chemical.source,
                    source_id: chemical.source_id,
                });
            }
            // Turn the retrievingChemicalString boolean false to hide the message about retreiving chemicals
            this.retrievingChemicalString = false;
        });
        console.log(this.chemicalList);
    }

    get chemicalCount() {
        return this.chemicalList.length;
    }

    get chemicalSearchErrors() {
        const errors = [];
        if (this.$v.chemicalSearchQuery.$dirty) {
            if (!this.$v.chemicalSearchQuery.required) {
                errors.push( generateValidationError( 'required', 'Chemical ID', null ));
            } else if (!this.$v.chemicalSearchQuery.numeric) {
                errors.push( generateValidationError( 'numeric', 'Chemical ID', null ));
            }
        }
        return errors;
    }

    get isInvalid() {
        return this.$v.$invalid;
    }

    private submitChemicalSearch() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            // this.$router.push({ path: '/curation/ChemicalLoad/' + this.chemicalSearchQuery });
            console.log(this.chemicalSearchQuery);
            const user = store.getters['auth/getUser'];
            API_CHEMICAL_FETCH( this.chemicalSearchQuery, (data: any) => {
                 this.chemicalName = data.name;
            });
        }
    }

    private validations() {
        return {
            chemicalSearchQuery: { required, numeric },
        };
    }
}
</script>

<style lang="scss" scoped>
</style>

