<template>
    <div class='participants-block'>
        <v-card
            tile
            color="grey lighten-2"
            class="pa-1 pl-4"
        >
            <v-row>
                <v-col xl="4" lg="4" md="4" sm="12" xs="12">
                    <v-textarea
                        outlined
                        background-color="white"
                        light
                        rows="11" 
                        hide-details="auto"
                        label="Enter identifiers separated by new lines"
                        class='pb-0'
                        v-model="participants"
                        :error-messages="participantsErrors"
                        @input="$v.participants.$touch()"
                        @blur="$v.participants.$touch()"
                    >
                    </v-textarea>
                </v-col>
                <v-col xl="4" lg="4" md="4" sm="12" xs="12">
                    <v-autocomplete 
                        v-model="organismID"
                        background-color="white"
                        outlined
                        :items="organismOptions"
                        item-text="name"
                        item-value="id"
                        label="Select organism"
                        clearable
                        dense
                        :error-messages="organismIDErrors"
                        @change="$v.organismID.$touch()"
                    >
                    </v-autocomplete>
                    <v-autocomplete 
                        v-model="participantTypeID"
                        background-color="white"
                        :items="participantTypes"
                        item-text="name"
                        item-value="id"
                        label="Select participant type"
                        clearable
                        outlined
                        dense        
                        :error-messages="participantTypeIDErrors"
                        @change="$v.participantTypeID.$touch()"
                    >
                    </v-autocomplete>
                    <v-autocomplete 
                        v-model="experimentalRoleID"
                        background-color="white"
                        outlined
                        :items="experimentalRoles"
                        item-text="name"
                        item-value="id"
                        label="Select experimental role"
                        clearable
                        dense          
                        :error-messages="experimentalRoleIDErrors"
                        @change="$v.experimentalRoleID.$touch()"
                    >
                    </v-autocomplete>
                    <v-autocomplete 
                        v-model="identifierTypeID"
                        background-color="white"
                        outlined
                        :items="identifierTypes"
                        item-text="name"
                        item-value="id"
                        label="Select identifier type"
                        clearable
                        dense
                        :error-messages="identifierTypeIDErrors"
                        @change="$v.identifierTypeID.$touch()"
                    >
                    </v-autocomplete>
                    <v-btn
                        color="success"
                        :disabled="isInvalid"
                        @click="mapParticipants"
                    >
                        Verify Participants <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-col>
                <v-col xl="4" lg="4" md="4" sm="12" xs="12">
                    <v-list
                        flat
                        subheader
                        v-if="participantSets.length > 0"
                    >
                        <v-subheader>Validated Participant Sets</v-subheader>
                        <v-list-item
                            v-for="(participantSet, i) in participantSets"
                            :key="i"
                        >
                            <v-list-item-action>
                                <v-btn 
                                    icon 
                                    color="red"
                                    title="Remove this participant set"
                                    @click="removeParticipantSet(i)"
                                >
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title v-text="participantSetTitle(i)"></v-list-item-title>
                                <v-list-item-subtitle v-text="participantSetSubtitle(i)"></v-list-item-subtitle>
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
import { required } from 'vuelidate/lib/validators';
import { generateValidationError } from '@/utils/ValidationErrors';
import { OrganismEntry, OrganismHash } from '@/models/annotation/Organism';
import { EntityWorkflowBlock } from '@/models/curation/EntityWorkflows';

const annotation = namespace( 'annotation' );

interface SelectRecord {
    id: string;
    name: string;
}

interface ParticipantSet {
    participants: string[];
    participantMap: Map<string, string>;
    experimentalRoleName: string | undefined;
    experimentalRoleID: string;
    organismID: string;
    participantTypeID: string;
    identifierTypeID: string;
}

@Component
export default class ParticipantBlock extends Vue {
    @annotation.State private organisms!: OrganismHash;
    @annotation.State private experimentalRoles!: SelectRecord[];
    @annotation.State private participantTypes!: SelectRecord[];
    @annotation.State private identifierTypes!: SelectRecord[];
    @Prop({type: Number, default: 0}) private id!: number;
    @Prop({type: String, default: ''}) private name!: string;
    @Prop({type: String, default: ''}) private title!: string;
    @Prop({type: Boolean, default: false}) private required!: boolean;
    @Prop() private settings!: Record<string, string>;
    private participants: string = '';
    private organismID: string = '';
    private experimentalRoleID: string = '';
    private participantTypeID: string = '';
    private identifierTypeID: string = '';
    private participantSets: ParticipantSet[] = [];
    private loading: boolean = false;
    private showAlert: boolean = false;
    private alertMessage: string = '';

    get organismOptions() {
        const organismOptions = [];
        for (const [organismID, organism] of Object.entries(this.organisms)) {
            let organismName = organism.official_name;
            if (organism.strain !== '' && organism.strain !== undefined) {
                organismName = organismName + ' (' + organism.strain + ')';
            }
            organismOptions.push({ id: organismID, name: organismName });
        }
        return organismOptions.sort(this.selectNameSort);
    }

    get participantsErrors() {
        const errors = [];
        if (this.$v.participants.$dirty) {
            if (!this.$v.participants.required) {
                errors.push( generateValidationError( 'required', 'Identifiers', null ));
            }
        }
        return errors;
    }

    get organismIDErrors() {
        const errors = [];
        if (this.$v.organismID.$dirty) {
            if (!this.$v.organismID.required) {
                errors.push( generateValidationError( 'required', 'Organism', null ));
            }
        }
        return errors;
    }

    get participantTypeIDErrors() {
        const errors = [];
        if (this.$v.participantTypeID.$dirty) {
            if (!this.$v.participantTypeID.required) {
                errors.push( generateValidationError( 'required', 'Participant Type', null ));
            }
        }
        return errors;
    }

    get experimentalRoleIDErrors() {
        const errors = [];
        if (this.$v.experimentalRoleID.$dirty) {
            if (!this.$v.experimentalRoleID.required) {
                errors.push( generateValidationError( 'required', 'Experimental Role', null ));
            }
        }
        return errors;
    }

    get identifierTypeIDErrors() {
        const errors = [];
        if (this.$v.identifierTypeID.$dirty) {
            if (!this.$v.identifierTypeID.required) {
                errors.push( generateValidationError( 'required', 'Identifier Type', null ));
            }
        }
        return errors;
    }

    get isInvalid() {
        return this.$v.$invalid;
    }

    get isComplete() {
        return this.validateBlock();
    }

    private removeParticipantSet(participantSetID: number) {
        this.participantSets.splice(participantSetID, 1);
    }

    private participantSetTitle(participantSetID: number) {
        const participantCount = this.participantSets[participantSetID].participants.length;
        return participantCount + ' Participants';
    }

    private participantSetSubtitle(participantSetID: number) {
        const experimentalRoleName = this.participantSets[participantSetID].experimentalRoleName;
        return 'Experimental Role: ' + experimentalRoleName;
    }

    private mapParticipants() {
        this.loading = true;
        this.$v.$touch();
        if (!this.$v.$invalid) {
            this.participantSets.push({
                participants: this.participants.split(/[\r\n]+/),
                participantMap: new Map<string, string>(),
                experimentalRoleName: this.getExperimentalRoleName(this.experimentalRoleID),
                experimentalRoleID: this.experimentalRoleID,
                organismID: this.organismID,
                participantTypeID: this.participantTypeID,
                identifierTypeID: this.identifierTypeID,
            });
        }
        this.loading = false;
    }

    private getExperimentalRoleName(experimentalRoleID: string) {
        for (const experimentalRole of this.experimentalRoles) {
            if (experimentalRole.id === experimentalRoleID) {
                return experimentalRole.name;
            }
        }
        return undefined;
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

    private completeBlock() {
        this.loading = true;
        if (this.validateBlock()) {
            this.$emit( 'complete', this.id, this.participantSets );
        }
        this.loading = false;
    }

    private removeBlock() {
        this.$emit( 'remove', this.id );
    }

    private validateBlock() {
        let isValid = true;
        const participantSetCount = this.participantSets.length;
        if (participantSetCount < Number(this.settings.min) || participantSetCount > Number(this.settings.max)) {
            isValid = false;
        }
        return isValid;
    }

    private validations() {
        return {
            participants: { required },
            organismID: { required },
            participantTypeID: { required },
            experimentalRoleID: { required },
            identifierTypeID: { required },
        };
    }

}
</script>

<style lang="scss">
</style>