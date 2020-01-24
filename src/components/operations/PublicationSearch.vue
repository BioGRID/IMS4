<template>
    <div class="publication-search">
        <v-container fluid class='pt-0'>
            <v-sheet
                color='highlight lighten-3'
                class='pa-2'
            >
                <v-icon color='primary' class='float-right'>mdi-magnify</v-icon>
                <h3>Get Started | <span class='subtitle-2'>Search for a publication</span></h3>
                <v-form class='mt-2'>
                    <v-text-field 
                        label="Publication ID"
                        :error-messages="publicationIDErrors"
                        light
                        required
                        dense
                        solo
                        v-model.trim="publicationID"
                        @input="$v.publicationID.$touch()"
                        @blur="$v.publicationID.$touch()"
                    />
                    <v-select
                        class='pb-0 mb-0'
                        label="Publication Type" 
                        :items="publicationTypes"
                        light
                        solo
                        required
                        dense
                        :value="publicationType"
                        v-model.trim="publicationType"
                    />
                    <v-btn 
                        @click="submitPublicationSearch"
                        size="x-large"
                        color="success"
                        light
                        solo
                        :disabled="isInvalid"
                    >Search <v-icon>mdi-magnify</v-icon></v-btn>
                </v-form>
            </v-sheet>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { required, numeric, maxLength } from 'vuelidate/lib/validators';
import { printableAsciiOnly, lettersAndSpacesOnly } from '@/utils/Validators';
import { generateValidationError } from '@/utils/ValidationErrors';
import Vuelidate from 'vuelidate';

Component.registerHooks(['validations']);
Vue.use(Vuelidate);

@Component
export default class PublicationSearch extends Vue {
    private publicationID: string = '';
    private publicationType: string = 'pubmed';
    private maxPublicationIDLength: number = 8;
    private publicationTypes = [
        { text: 'Pubmed', value: 'pubmed' },
        { text: 'Pre-Publication', value: 'prepub' },
    ];

    get publicationIDErrors() {
        const errors = [];
        if (this.$v.publicationID.$dirty) {
            if (!this.$v.publicationID.required) {
                errors.push( generateValidationError( 'required', 'Publication ID', null ));
            } else if (!this.$v.publicationID.numeric) {
                errors.push( generateValidationError( 'numeric', 'Publication ID', null ));
            } else if (!this.$v.publicationID.maxLength) {
                errors.push( generateValidationError( 'maxLength', 'Publication ID', String(this.maxPublicationIDLength) ));
            }
        }
        return errors;
    }

    get isInvalid() {
        return this.$v.$invalid;
    }

    private submitPublicationSearch() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            console.log(this.publicationID);
            console.log(this.publicationType);
        }
    }

    private validations() {
        return {
            publicationID: { required, numeric, maxLength: maxLength(this.maxPublicationIDLength) },
        };
    }

}
</script>
