<template>
    <div class='add-chemical-name-form'>
        <v-form>
            <v-text-field
                label="Add New Entry"  
                ref="addPanelField" 
                :error-messages="newChemicalNameErrors"
                dense
                v-model.trim="newEntry"
                @input="$v.newEntry.$touch()"
                @blur="$v.newEntry.$touch()"
            >
            </v-text-field>

            <v-btn 
                @click="addEntry"
                size="x-large"
                color="success"
                :disabled="isInvalid"
            >Add New Chemical Name</v-btn>

        </v-form>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { required } from 'vuelidate/lib/validators';
import { printableAsciiOnly, lettersAndSpacesOnly, inArrayOfObjects } from '@/utils/Validators';
import { generateValidationError } from '@/utils/ValidationErrors';

@Component
export default class AddChemicalNameForm extends Vue {
    @Prop(Array) private panelDisplayRows!: any[];
    private newEntry: string = '';

    private addEntry() {
        this.panelDisplayRows.push( {['name']: this.newEntry} );
        this.newEntry = '';
        this.$v.$reset();
    }

    get newChemicalNameErrors() {
        const errors = [];
        if (this.$v.newEntry.$dirty) {
            if (!this.$v.newEntry.required) {
                errors.push( generateValidationError( 'required', 'Chemical Name', null ));
            } else if (!this.$v.newEntry.inArrayOfObjects) {
                errors.push( generateValidationError( 'valueinarray', 'Chemical Name', null ));
            }
        }
        return errors;
    }

    get isInvalid() {
        return this.$v.$invalid;
    }

    private validations() {
        return {
            newEntry: { required, inArrayOfObjects: inArrayOfObjects( this.panelDisplayRows, 'name', [] ) },
        };
    }

}
</script>

<style lang="scss">
.add-chemical-name-form {
    padding-top: 25px;
}
</style>