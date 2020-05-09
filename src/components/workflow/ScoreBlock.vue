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
                        @change="$v.scoreTypeID.$touch()"
                    >
                    </v-autocomplete>
                    <v-btn
                        color="success"
                        :disabled="isInvalid"
                        @click="mapScores"
                    >
                        Verify Scores <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-col>
                <v-col xl="4" lg="4" md="4" sm="12" xs="12">
                    <v-list
                        flat
                        subheader
                        v-if="scoreSets.length > 0"
                    >
                        <v-subheader>Validated Score Sets</v-subheader>
                        <v-list-item
                            v-for="(scoreSet, i) in scoreSets"
                            :key="i"
                        >
                            <v-list-item-action>
                                <v-btn 
                                    icon 
                                    color="red"
                                    title="Remove this score set"
                                    @click="removeScoreSet(i)"
                                >
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title v-text="scoreSetTitle(i)"></v-list-item-title>
                                <v-list-item-subtitle v-text="scoreSetSubtitle(i)"></v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
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
            <v-overlay
                :absolute="true"
                :opacity="0.7"
                :value="loading"
                z-index="1000"
            >
                <v-progress-circular 
                    indeterminate 
                    color="yellow accent-4"
                    size="120"
                    width="10"
                >Processing</v-progress-circular>
            </v-overlay>
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

interface ScoreSet {
    scores: string[];
    scoreTypeID: string;
    scoreTypeName: string;
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
    private scoreSets: ScoreSet[] = [];
    private scoreSetSizes: number[] = [];
    private scoreTypeNameLookup: Record<string, string> = {};
    private loading: boolean = false;
    private mustBeEqual: boolean = false;

    private created() {
        if (this.settings.size !== undefined && this.settings.size.length > 0) {
            if (this.settings.size.indexOf('equal') !== -1) {
                this.mustBeEqual = true;
            }
        }
    }

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
        if (this.$v.scoreTypeID.$dirty) {
            if (!this.$v.scoreTypeID.required) {
                errors.push( generateValidationError( 'required', this.title, null ));
            }
        }
        return errors;
    }

    get isInvalid() {
        return this.$v.$invalid;
    }

    get scoreTypes() {
        const scoreTypes: SelectRecord[] = [];
        for (const [shortcode, attributeType] of Object.entries(this.attributeTypes)) {
            if (attributeType.attribute_type_category_id === 2) { // 2 is Score Category
                scoreTypes.push({ id: String(attributeType.attribute_type_id), name: attributeType.name });
                this.scoreTypeNameLookup[String(attributeType.attribute_type_id)] = attributeType.name;
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
        let isValid = true;

        const scoreSetCount = this.scoreSets.length;
        if (scoreSetCount <= 0) {
            isValid = false;
        }

        if (isValid) {
            let currentCount: number = 0;
            for (const scoreCount of this.scoreSetSizes) {

                if (currentCount === 0) {
                    currentCount = scoreCount;
                }

                // If must be equal, we only continue if all the counts match
                if (this.mustBeEqual && scoreCount === currentCount) {
                    continue;
                }

                isValid = false;
                break;
            }
        }

        return isValid;
    }

    private completeBlock() {
        if (this.validateBlock()) {
            this.$emit( 'complete', this.id, this.scoreSets );
        }
    }

    private removeBlock() {
        this.$emit( 'remove', this.id );
    }

    private validations() {
        return {
            scores: { required, complexNumericNewlines },
            scoreTypeID: { required },
        };
    }

    private mapScores() {
        this.loading = true;
        this.$v.$touch();
        if (!this.$v.$invalid) {
            const splitScores: string[] = this.scores.split(/[\r\n]+/);
            const scoreSet: string[] = [];
            for (let score of splitScores) {
                score = score.trim();
                if (score.length > 0) {
                    scoreSet.push(score);
                }
            }

            this.scoreSets.push({
                scores: scoreSet,
                scoreTypeID: this.scoreTypeID,
                scoreTypeName: this.scoreTypeNameLookup[this.scoreTypeID],
            });

            this.scoreSetSizes.push(scoreSet.length);
        }
        this.loading = false;
    }

    private removeScoreSet(scoreSetID: number) {
        this.scoreSets.splice(scoreSetID, 1);
        this.scoreSetSizes.splice(scoreSetID, 1);
    }

    private scoreSetTitle(scoreSetID: number) {
        const scoreCount = this.scoreSets[scoreSetID].scores.length;
        return scoreCount + ' Scores';
    }

    private scoreSetSubtitle(scoreSetID: number) {
        const scoreTypeName = this.scoreSets[scoreSetID].scoreTypeName;
        return 'Score Type: ' + scoreTypeName;
    }

}
</script>

<style lang="scss">
</style>