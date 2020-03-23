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
            <h1>Permission Add <v-icon color="deep-purple lighten-1" large class="">mdi-account-badge</v-icon></h1>
            <div class="subtitle-1">Use the following form to add a new permission to the application. Fill in the fields, and click the 'Add Permission' button.</div>
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
                        >Add Permission</v-btn>
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
import { printableAsciiOnly, lettersAndSpacesOnly } from '@/utils/Validators';
import { generateValidationError } from '@/utils/ValidationErrors';
import { API_PERMISSION_ADD } from '@/models/auth/Permission';

const auth = namespace( 'auth' );

@Component
export default class PermissionAdd extends Vue {
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

    @Watch( 'permName' )
    private onPermNameChanged() {
        this.permName = this.permName.toUpperCase();
    }

    @Watch( 'permCategory' )
    private onPermCategoryChanged() {
        this.permCategory = this.permCategory.toUpperCase();
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
            this.addPermission({
                name: this.permName,
                description: this.permDescription,
                category: this.permCategory,
                level: this.permLevel,
            });
        }
    }

    private async addPermission( payload: object ) {
        const status = await API_PERMISSION_ADD( payload );
        if (status) {
            Vue.prototype.$socket.sendObj({
                target: 0,
                namespace: 'auth',
                mutation: '',
                action: 'fetch_permissions',
            });
        }
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
