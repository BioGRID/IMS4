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
             
             <div>
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
            </div>
            
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { required, numeric } from 'vuelidate/lib/validators';
import { generateValidationError } from '@/utils/ValidationErrors';
import Vuelidate from 'vuelidate';

@Component
export default class ChemicalManager extends Vue {
     private chemicalSearchQuery: string = '20489023';
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
            this.$router.push({ path: '/curation/ChemicalLoad/' + this.chemicalSearchQuery });
        }
    }

    private validations() {
        return {
            chemicalSearchQuery: { required, numeric },
        };
    }
}
</script>

