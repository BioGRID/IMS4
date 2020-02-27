<template>
    <div id="permission-manager">
        <v-container fluid class='pt-0'>
            <v-btn 
                class='float-right mt-4'
                small
                color='primary'
                to='/admin/chemical/chemicalmanager'
                dark
            >< Back</v-btn>
            <h1>Chemical Edit <v-icon color="cyan darken-3" large class="">mdi-account-group</v-icon></h1>
            <div class="subtitle-1">Use the following form to modify an existing chemical. Fill in the fields, and click the 'Update Chemical' button.</div>
            <v-card
                class="mt-2 pa-0"
            >

                <v-card-text>
                    <v-sheet
                        color="blue-grey darken-3" 
                        class="pa-3"
                    >
                        <v-form>
                            <v-row>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-text-field 
                                        label="Chemical Name"
                                        :error-messages="chemicalNameErrors"
                                        dark
                                        required
                                        dense
                                        v-model.trim="chemicalName"
                                        @input="$v.chemicalName.$touch()"
                                        @blur="$v.chemicalName.$touch()"
                                    />
                                </v-col>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-text-field 
                                        label="Chemical Description" 
                                        :error-messages="chemicalDescriptionErrors"
                                        dark
                                        required
                                        dense
                                        v-model.trim="chemicalDescription"
                                        @input="$v.chemicalDescription.$touch()"
                                        @blur="$v.chemicalDescription.$touch()"
                                    />
                                </v-col>
                            </v-row>
                        <v-btn 
                            @click="submitChemical"
                            size="x-large"
                            color="success"
                            dark
                            :disabled="isInvalid"
                        >Update Chemical</v-btn>
                        </v-form>
                    </v-sheet>
                </v-card-text>
            </v-card>

        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { required } from 'vuelidate/lib/validators';
import { printableAsciiOnly } from '@/utils/Validators';
import { generateValidationError } from '@/utils/ValidationErrors';
import { API_CHEMICAL_FETCH } from '@/models/annotation/Chemical';

const auth = namespace( 'auth' );

@Component
export default class ChemicalEdit extends Vue {
    private chemicalID: number = 0;
    private chemicalName: string = '';
    private chemicalDescription: string = '';
    public created() {
        this.initializeFieldValues();
    }

    private initializeFieldValues() {
        API_CHEMICAL_FETCH( this.$route.params.id, (data: any) => {
            this.chemicalName = data.name;
            this.chemicalID = data.chemical_id;
            this.chemicalDescription = data.description;
        });
    }

    get chemicalNameErrors() {
        const errors = [];
        if (this.$v.chemicalName.$dirty) {
            if (!this.$v.chemicalName.required) {
                errors.push( generateValidationError( 'required', 'Chemical Name', null ));
            } else if (!this.$v.chemicalName.printableAsciiOnly) {
                errors.push( generateValidationError( 'printableAsciiOnly', 'Chemical Name', null ));
            }
        }
        return errors;
    }

    get chemicalDescriptionErrors() {
        const errors = [];
        if (this.$v.chemicalDescription.$dirty) {
            if (!this.$v.chemicalDescription.required) {
                errors.push( generateValidationError( 'required', 'Chemical Description', null ));
            } else if (!this.$v.chemicalDescription.printableAsciiOnly) {
                errors.push( generateValidationError( 'printableAsciiOnly', 'Chemical Description', null ));
            }
        }
        return errors;
    }

    get isInvalid() {
        return this.$v.$invalid;
    }

    private submitChemical( ) {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            // need to write this
        }
    }

    private validations() {
        return {
            chemicalName: { required, printableAsciiOnly },
            chemicalDescription: { required, printableAsciiOnly },
        };
    }
}

</script>
