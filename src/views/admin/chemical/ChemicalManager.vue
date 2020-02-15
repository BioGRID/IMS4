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
                :columns="chemicalHeaders"
                :rows="chemicalList"
                :rowsPerPage="100"
                :totalRows="chemicalCount"
                :pagination="true"
                :showSearch="true"
            >
                <template slot-scope="{ row }">
                    <td class='text-left' nowrap>{{ row.name }}</td>
                </template>

            </ACEDataTable>
            
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { required, numeric } from 'vuelidate/lib/validators';
import { generateValidationError } from '@/utils/ValidationErrors';
import Vuelidate from 'vuelidate';
import { ChemicalEntry, ChemicalHash, API_CHEMICAL_FETCH } from '@/models/annotation/Chemical';
import axios from 'axios';
import store from '@/store/store';
import ACEDataTable from '@/components/data/ACEDataTable.vue';

@Component({
    components: {
        ACEDataTable,
    },
})
export default class ChemicalManager extends Vue {
    private chemicalSearchQuery: string = '301';
    private chemicalName: string = "";
    private chemicalList: object[] = [];
    private chemicalTableHeaders: object[] = [
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
    ];

    private created() {
        this.generateChemicalList();
    }

    private generateChemicalList() {
        let chemicalGroup: any;
        console.log("in generate chemical list");
        const user = store.getters['auth/getUser'];
        API_CHEMICAL_FETCH( (data: ChemicalEntry[]) => {
            const chemicalHash: chemicalHash = {};
            for (const chemical of data) {
                chemicalHash[Number(chemical.id)] = chemical;
            }
            for ( chemical of Object.values(this.chemicalHash)) {
            this.chemicalList.push({
                name: chemical.name,
            });
        }
        });
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
            API_CHEMICAL_FETCH( this.chemicalSearchQuery, (data: ChemicalEntry[]) => {
                 this.chemicalName = data.name;
                 console.log("chemical name: " + this.chemicalName);
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

