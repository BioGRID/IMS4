<template>
    <div class='text-block'>
        <v-card color="grey lighten-2" class="pa-1 pl-4 pr-4">
            <v-row>
                <v-col xl="12" lg="12" md="12" sm="12" xs="12">
                    <v-textarea
                        outlined
                        background-color="white"
                        light
                        rows="6" 
                        hide-details="auto"
                        label="Enter text separated by new lines"
                        class='pb-0'
                        v-model="text"
                        :error-messages="textErrors"
                        @input="$v.text.$touch()"
                        @blur="$v.text.$touch()"
                    >
                    </v-textarea>
                </v-col>
            </v-row>
            <v-row>
                <v-col xl="12" lg="12" md="12" sm="12" xs="12">
                    <v-btn
                        color="success"
                        :disabled="!isComplete"
                        @click="completeBlock"
                        title="Remove block from curation workflow"
                        fab
                        small
                        class='elevation-2 mr-2' 
                    >
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                    <v-btn
                        color="error"
                        v-if="!required"
                        @click="removeBlock"
                        title="Finish Block, Mark as Completed"
                        fab
                        small
                        class='elevation-2'
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-col> 
            </v-row>
        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { required } from 'vuelidate/lib/validators';
import { generateValidationError } from '@/utils/ValidationErrors';

@Component
export default class TextBlock extends Vue {
    @Prop({type: Number, default: 0}) private id!: number;
    @Prop({type: String, default: ''}) private name!: string;
    @Prop({type: String, default: ''}) private title!: string;
    @Prop({type: Boolean, default: false}) private required!: boolean;
    @Prop() private settings!: Record<string, string>;
    private text: string = '';

    get isComplete() {
        return this.validateBlock();
    }

    get textErrors() {
        const errors = [];
        if (this.$v.text.$dirty) {
            if (!this.$v.text.required) {
                errors.push( generateValidationError( 'required', this.title, null ));
            }
        }
        return errors;
    }

    private validateBlock() {
        return !this.$v.$invalid;
    }

    private completeBlock() {
        if (this.validateBlock()) {
            this.$emit( 'complete', this.id, this.text.split(/[\r\n]+/) );
        }
    }

    private removeBlock() {
        this.$emit( 'remove', this.id );
    }

    private validations() {
        return {
            text: { required },
        };
    }

}
</script>

<style lang="scss">
</style>