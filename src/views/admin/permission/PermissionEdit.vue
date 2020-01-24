<template>
    <div id="permission-manager">
        <v-container fluid class='pt-0'>
            <v-btn 
                class='float-right mt-4'
                small
                color='primary'
                to='/admin/permission/permissionmanager'
                dark
            >< Back</v-btn>
            <h1>Permission Update <v-icon color="deep-purple lighten-1" large class="">mdi-account-badge</v-icon></h1>
            <div class="subtitle-1">Use the following form to edit an existing permission used by this application. Fill in the fields, and click the 'Update Permission' button.</div>
            <v-card
                class="mt-2 pa-0"
            >

                <v-card-text>
                    <v-alert type="warning" dense>
                        Changing <strong>Permission Name</strong> on an existing permission is not recommended. Many external applications have features built around existing permission names, so changing the name can have unintended consequences. Only modify the name if you are confident these problems do not exist (example to fix a typo shortly after creating a new permission).
                    </v-alert>
                    <v-sheet
                        color="blue-grey darken-3" 
                        class="pa-3"
                    >
                        <v-form>
                            <v-row>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-text-field 
                                        label="Permission Name"
                                        :error-messages="permNameErrors"
                                        dark
                                        required
                                        dense
                                        v-model.trim="permName"
                                        @input="$v.permName.$touch()"
                                        @blur="$v.permName.$touch()"
                                    />
                                </v-col>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-text-field 
                                        label="Permission Description" 
                                        :error-messages="permDescriptionErrors"
                                        dark
                                        required
                                        dense
                                        v-model.trim="permDescription"
                                        @input="$v.permDescription.$touch()"
                                        @blur="$v.permDescription.$touch()"
                                    />
                                </v-col>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-text-field 
                                        label="Permission Category"
                                        :error-messages="permCategoryErrors"
                                        dark
                                        required
                                        dense
                                        v-model.trim="permCategory"
                                        @input="$v.permCategory.$touch()"
                                        @blur="$v.permCategory.$touch()"
                                    />
                                </v-col> 
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-select
                                        label="Permission Level" 
                                        :items="permLevels"
                                        dark
                                        required
                                        dense
                                        v-model.trim="permLevel"
                                    />
                                </v-col>
                            </v-row>
                        <v-btn 
                            @click="submitPermission"
                            size="x-large"
                            color="success"
                            dark
                            :disabled="isInvalid"
                        >Update Permission</v-btn>
                        </v-form>
                    </v-sheet>
                </v-card-text>
            </v-card>

        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { required } from 'vuelidate/lib/validators';
import { State, namespace } from 'vuex-class';
import { printableAsciiOnly, lettersAndSpacesOnly } from '@/utils/Validators';
import { generateValidationError } from '@/utils/ValidationErrors';
import { API_PERMISSION_UPDATE } from '@/models/auth/Permission';

const auth = namespace( 'auth' );

@Component
export default class PermissionEdit extends Vue {
    @auth.State private permissions!: any;
    private permID: number = 0;
    private permName: string = '';
    private permDescription: string = '';
    private permCategory: string = '';
    private permLevel: string = 'observer';
    private permLevels: object[] = [
        { text: 'Observer', value: 'observer' },
        { text: 'Standard', value: 'standard' },
        { text: 'Manager', value: 'manager' },
        { text: 'Power User', value: 'poweruser' },
        { text: 'Admin', value: 'admin' },
    ];

    public created() {
        this.permName = this.$route.params.name;
        this.initializeFieldValues();
    }

    @Watch( 'permName' )
    private onPermNameChanged() {
        this.permName = this.permName.toUpperCase();
    }

    @Watch( 'permCategory' )
    private onPermCategoryChanged() {
        this.permCategory = this.permCategory.toUpperCase();
    }

    private initializeFieldValues() {
        const permInfo = this.permissions[this.permName];
        this.permID = permInfo.id;
        this.permName = permInfo.name;
        this.permDescription = permInfo.description;
        this.permCategory = permInfo.category;
        this.permLevel = permInfo.level;
    }

    get permNameErrors() {
        const errors = [];
        if (this.$v.permName.$dirty) {
            if (!this.$v.permName.required) {
                errors.push( generateValidationError( 'required', 'Permission name', null ));
            } else if (!this.$v.permName.lettersAndSpacesOnly) {
                errors.push( generateValidationError( 'lettersAndSpacesOnly', 'Permission name', null ));
            }
        }
        return errors;
    }

    get permDescriptionErrors() {
        const errors = [];
        if (this.$v.permDescription.$dirty) {
            if (!this.$v.permDescription.printableAsciiOnly) {
                errors.push( generateValidationError( 'printableAsciiOnly', 'Permission description', null ));
            }
        }
        return errors;
    }

    get permCategoryErrors() {
        const errors = [];
        if (this.$v.permCategory.$dirty) {
            if (!this.$v.permCategory.required) {
                errors.push( generateValidationError( 'required', 'Permission category', null ));
            } else if (!this.$v.permCategory.lettersAndSpacesOnly) {
                errors.push( generateValidationError( 'lettersAndSpacesOnly', 'Permission category', null ));
            }
        }
        return errors;
    }

    get isInvalid() {
        return this.$v.$invalid;
    }

    private submitPermission( ) {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            this.updatePermission({
                name: this.permName,
                description: this.permDescription,
                category: this.permCategory,
                level: this.permLevel,
            });
        }
    }

    private updatePermission( payload: object ) {
        API_PERMISSION_UPDATE( payload, this.permID, () => {
            Vue.prototype.$socket.sendObj({
                target: 0,
                namespace: 'auth',
                mutation: '',
                action: 'fetch_permissions',
            });
        });
    }

    private validations() {
        return {
            permName: { required, lettersAndSpacesOnly },
            permDescription: { printableAsciiOnly },
            permCategory: { required, lettersAndSpacesOnly },
        };
    }
}

</script>
