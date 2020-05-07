<template>
    <div class='text-block'>
        <v-card color="grey lighten-2" class="pa-1 pl-4 pr-4">
            <v-row>
                <v-col xl="4" lg="4" md="4" sm="12" xs="12">
                    <v-textarea
                        outlined
                        background-color="white"
                        light
                        rows="10" 
                        hide-details="auto"
                        label="Enter score values separated by newlines"
                        class='pb-0'
                        v-model="scores"
                        :error-messages="scoreErrors"
                        @input="$v.scores.$touch()"
                        @blur="$v.scores.$touch()"
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
import { required, decimal } from 'vuelidate/lib/validators';
import { generateValidationError } from '@/utils/ValidationErrors';

@Component
export default class ScoreBlock extends Vue {
    @Prop({type: Number, default: 0}) private id!: number;
    @Prop({type: String, default: ''}) private name!: string;
    @Prop({type: String, default: ''}) private title!: string;
    @Prop({type: Boolean, default: false}) private required!: boolean;
    @Prop() private settings!: Record<string, string>;
    private scores: string = '';

    get isComplete() {
        return this.validateBlock();
    }

    get scoreErrors() {
        const errors = [];
        if (this.$v.scores.$dirty) {
            if (!this.$v.scores.required) {
                errors.push( generateValidationError( 'required', this.title, null ));
            } else if (!this.$v.scores.decimal ) {
                errors.push( generateValidationError( 'decimal', this.title, null ));
            }
        }
        return errors;
    }

    private validateBlock() {
        return !this.$v.$invalid;
    }

    private completeBlock() {
        if (this.validateBlock()) {
            this.$emit( 'complete', this.id, this.scores.split(/[\r\n]+/) );
        }
    }

    private removeBlock() {
        this.$emit( 'remove', this.id );
    }

    private validations() {
        return {
            scores: { required, decimal },
        };
    }

}
</script>

<style lang="scss">
</style>