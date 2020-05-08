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
                <v-col xl="4" lg="4" md="4" sm="12" xs="12">
                    <v-autocomplete 
                        v-model="scoreTypeID"
                        background-color="white"
                        outlined
                        :items="scoreTypes"
                        item-text="name"
                        item-value="id"
                        label="Select score type"
                        clearable
                        dense
                        :error-messages="scoreTypeIDErrors"
                        @change="$v.scooreTypeID.$touch()"
                    >
                    </v-autocomplete>
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
import { complexNumericNewlines } from '@/utils/Validators';
import { generateValidationError } from '@/utils/ValidationErrors';
import { AttributeTypeEntry } from '@/models/curation/AttributeType';

const curation = namespace( 'curation' );

interface SelectRecord {
    id: string;
    name: string;
}

@Component
export default class ScoreBlock extends Vue {
    @curation.State private attributeTypes!: AttributeTypeEntry[];
    @Prop({type: Number, default: 0}) private id!: number;
    @Prop({type: String, default: ''}) private name!: string;
    @Prop({type: String, default: ''}) private title!: string;
    @Prop({type: Boolean, default: false}) private required!: boolean;
    @Prop() private settings!: Record<string, string>;
    private scores: string = '';
    private scoreTypeID: string = '';

    get isComplete() {
        return this.validateBlock();
    }

    get scoreErrors() {
        const errors = [];
        if (this.$v.scores.$dirty) {
            if (!this.$v.scores.required) {
                errors.push( generateValidationError( 'required', this.title, null ));
            } else if (!this.$v.scores.complexNumericNewlines ) {
                errors.push( generateValidationError( 'complexNumericNewlines', this.title, null ));
            }
        }
        return errors;
    }

    get scoreTypeIDErrors() {
        const errors = [];
        if (this.$v.scooreTypeID.$dirty) {
            if (!this.$v.scooreTypeID.required) {
                errors.push( generateValidationError( 'required', this.title, null ));
            }
        }
        return errors;
    }

    get scoreTypes() {
        const scoreTypes: SelectRecord[] = [];
        for (const [shortcode, attributeType] of Object.entries(this.attributeTypes)) {
            if (attributeType.attribute_type_category_id === 2) { // 2 is Score Category
                scoreTypes.push({ id: String(attributeType.attribute_type_id), name: attributeType.name });
            }
        }
        return scoreTypes.sort(this.selectNameSort);
    }

    private selectNameSort(a: SelectRecord, b: SelectRecord) {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();

        if (nameA > nameB) {
            return 1;
        } else if (nameA < nameB) {
            return -1;
        }

        return 0;
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
            scores: { required, complexNumericNewlines },
            scooreTypeID: { required },
        };
    }

}
</script>

<style lang="scss">
</style>