<template>
    <div id="permission-manager">
        <v-container fluid class='pt-0'>
            <v-btn 
                class='float-right mt-4'
                small
                color='primary'
                to='/admin/curationgroup/curationgroupmanager'
                dark
            >< Back</v-btn>
            <h1>Curation Group Add <v-icon color="cyan darken-3" large class="">mdi-account-group</v-icon></h1>
            <div class="subtitle-1">Use the following form to add a new curation group to the application. Fill in the fields, and click the 'Add Curation Group' button.</div>
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
                                        label="Curation Group Name"
                                        :error-messages="curationGroupNameErrors"
                                        dark
                                        required
                                        dense
                                        v-model.trim="curationGroupName"
                                        @input="$v.curationGroupName.$touch()"
                                        @blur="$v.curationGroupName.$touch()"
                                    />
                                </v-col>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-text-field 
                                        label="Curation Group Description" 
                                        :error-messages="curationGroupDescriptionErrors"
                                        dark
                                        required
                                        dense
                                        v-model.trim="curationGroupDescription"
                                        @input="$v.curationGroupDescription.$touch()"
                                        @blur="$v.curationGroupDescription.$touch()"
                                    />
                                </v-col>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-select 
                                        label="Curation Group Organisms"
                                        v-model.trim="curationGroupOrganisms"
                                        :items="organismOptions"
                                        :menu-props="{ maxHeight: '400' }"
                                        :error-messages="curationGroupOrganismsErrors"
                                        dark
                                        required
                                        multiple
                                        dense
                                    />
                                </v-col> 
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-select 
                                        label="Curation Group Users"
                                        v-model.trim="curationGroupUsers"
                                        :items="userOptions"
                                        :menu-props="{ maxHeight: '400' }"
                                        :error-messages="curationGroupUsersErrors"
                                        dark
                                        required
                                        multiple
                                        dense
                                    />
                                </v-col>
                            </v-row>
                        <v-btn 
                            @click="submitCurationGroup"
                            size="x-large"
                            color="success"
                            dark
                            :disabled="isInvalid"
                        >Add Curation Group</v-btn>
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
import { OrganismEntry } from '@/models/annotation/Organism';
import { API_CURATION_GROUP_ADD } from '@/models/curation/CurationGroup';

const auth = namespace( 'auth' );
const annotation = namespace( 'annotation' );

@Component
export default class CurationGroupAdd extends Vue {
    @auth.State private users!: any;
    @annotation.State private organisms!: OrganismEntry[];
    private curationGroupName: string = '';
    private curationGroupDescription: string = '';
    private curationGroupOrganisms: string[] = [];
    private curationGroupUsers: string[] = [];

    get organismOptions() {
        const organismOptions: object[] = [];
        for (const organism of Object.values(this.organisms)) {
            let organismName = organism.official_name;
            if (organism.strain !== '' ) {
                organismName += ' (' + organism.strain + ')';
            }
            if (organism.deprecated === 0) {
                organismOptions.push({
                    text: organismName,
                    value: organism.id,
                });
            }
        }
        return organismOptions.sort( this.alphaOptionsSort );
    }

    get userOptions() {
        const userOptions: object[] = [];
        let user: any;
        for (user of Object.values(this.users)) {
            if (user.status !== 'inactive' && user.id !== 1) {
                userOptions.push({
                    text: user.name,
                    value: user.id,
                });
            }
        }
        return userOptions.sort( this.alphaOptionsSort );
    }

    get curationGroupNameErrors() {
        const errors = [];
        if (this.$v.curationGroupName.$dirty) {
            if (!this.$v.curationGroupName.required) {
                errors.push( generateValidationError( 'required', 'Curation Group Name', null ));
            } else if (!this.$v.curationGroupName.printableAsciiOnly) {
                errors.push( generateValidationError( 'printableAsciiOnly', 'Curation Group Name', null ));
            }
        }
        return errors;
    }

    get curationGroupDescriptionErrors() {
        const errors = [];
        if (this.$v.curationGroupDescription.$dirty) {
            if (!this.$v.curationGroupDescription.required) {
                errors.push( generateValidationError( 'required', 'Curation Group Description', null ));
            } else if (!this.$v.curationGroupDescription.printableAsciiOnly) {
                errors.push( generateValidationError( 'printableAsciiOnly', 'Curation Group Description', null ));
            }
        }
        return errors;
    }

    get curationGroupOrganismsErrors() {
        const errors = [];
        if (this.$v.curationGroupOrganisms.$dirty) {
            if (!this.$v.curationGroupOrganisms.required) {
                errors.push( generateValidationError( 'required', 'Curation Group Organisms', null ));
            }
        }
        return errors;
    }

    get curationGroupUsersErrors() {
        const errors = [];
        if (this.$v.curationGroupUsers.$dirty) {
            if (!this.$v.curationGroupUsers.required) {
                errors.push( generateValidationError( 'required', 'Curation Group Users', null ));
            }
        }
        return errors;
    }

    get isInvalid() {
        return this.$v.$invalid;
    }

    private submitCurationGroup( ) {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            this.addCurationGroup({
                curation_group_id: 0,
                name: this.curationGroupName,
                description: this.curationGroupDescription,
                organisms: this.curationGroupOrganisms,
                users: this.curationGroupUsers,
                deprecated: 0,
            });
        }
    }

    private async addCurationGroup( payload: object ) {
        const status = await API_CURATION_GROUP_ADD( payload );
        if (status) {
            Vue.prototype.$socket.sendObj({
                target: 0,
                namespace: 'curation',
                mutation: '',
                action: 'fetch_curation_groups',
            });
        }
    }

    private alphaOptionsSort( a: any, b: any ) {
        if (a.text > b.text) {
            return 1;
        } else if (a.text < b.text) {
            return -1;
        }
        return 0;
    }

    private validations() {
        return {
            curationGroupName: { required, printableAsciiOnly },
            curationGroupDescription: { required, printableAsciiOnly },
            curationGroupOrganisms: { required },
            curationGroupUsers: { required },
        };
    }
}

</script>
