<template>
    <div class='add-chemical-dbxrefs-form'>

       <v-form>

            <v-row>
            
                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                    <v-select
                        v-model="newSource"
                        :items="chemicalSources"
                        label="Select"
                    ></v-select>
                </v-col>
                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                    <v-text-field
                        label="Add New Source ID"
                        :error-messages="newSourceIDErrors"
                        dense
                        required
                        v-model.trim="newSourceID"
                        @input="$v.newSourceID.$touch()"
                        @blur="$v.newSourceID.$touch()"
                    >
                    </v-text-field>
                </v-col>
            
            </v-row>

            <v-btn 
                @click="addEntry"
                size="x-large"
                color="success"
                :disabled="isInvalid"
            >Add New Chemical Database Reference</v-btn>

        </v-form>

    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { required } from 'vuelidate/lib/validators';
import { printableAsciiOnly, lettersAndSpacesOnly, inArray } from '@/utils/Validators';
import { generateValidationError } from '@/utils/ValidationErrors';

@Component
export default class AddChemicalNameForm extends Vue {
    @Prop(Array) private panelDisplayRows!: any[];
    private showHint: boolean = false;
    private newHint: string = '';
    private newSourceID: string = '';
    private newSource: string = '';
    private chemicalSources: string[] = ['ChemSpider', 'ChEMBL'];

    private addEntry() {
        // need to work
    }

    get newSourceIDErrors() {
        const errors = [];
        if (this.$v.newSourceID.$dirty) {
            if (!this.$v.newSourceID.required) {
                errors.push( generateValidationError( 'required', 'External Database ID', null ));
            } else if (!this.$v.newSourceID.inArray) {
                errors.push( generateValidationError( 'inArray', 'Source ID name', null ));
            }
        }
        return errors;
    }

    get isInvalid() {
        return this.$v.$invalid;
    }

    private validations() {
        return {
            newSourceID: { required, inArray: inArray( this.panelDisplayRows ) },
        };
    }


}
</script>

<style lang="scss">
.add-chemical-dbxrefs-form {
    padding-top: 25px;
}
</style>