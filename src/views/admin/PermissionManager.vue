<template>
    <div id="permission-manager">
        <v-container fluid class='pt-0'>
            <v-btn 
                class='float-right mt-4'
                small
                color='primary'
                to='/elements/admin'
                dark
            >< Back</v-btn>
            <h1>Permission Manager</h1>
            <div class="subtitle-1">Use the add new permission form below to add a new permission to the system. You can also use the table below to make adjustments to the access permissions used by the system. <strong>Note</strong>: Users will need to logout and then log back in again for changes to be reflected in their permissions.</div>
            <v-card
                outlined
                color="grey lighten-2"
                class="mt-2 pa-0"
            >
                <v-card-title>
                    Add New Permission
                </v-card-title>
                <v-card-subtitle class="pb-0">
                    Use this form to add a new Permission Type to the Database
                </v-card-subtitle>

                <v-card-text>
                <v-form>
                    <v-row>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                            <v-text-field 
                                label="Permission Name"
                                :error-messages="permNameErrors"
                                light
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
                                light
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
                                light
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
                                light
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
                    :disabled="isInvalid"
                >Add Permission</v-btn>
                </v-form>
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
import axios from 'axios';

const auth = namespace( 'auth' );

@Component
export default class PermissionManager extends Vue {
    @auth.State private user!: any;
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
        this.permName = this.convertToUpper(this.permName);
    }

    @Watch( 'permCategory' )
    private onPermCategoryChanged() {
        this.permCategory = this.convertToUpper(this.permCategory);
    }

    get permNameErrors() {
        const errors = [];
        if (this.$v.permName.$dirty) {
            if (!this.$v.permName.required) {
                errors.push( 'Permission Name is required' );
            } else if (!this.$v.permName.lettersAndSpacesOnly) {
                errors.push( 'Permission Name can contain only letters and spaces' );
            }
        }
        return errors;
    }

    get permDescriptionErrors() {
        const errors = [];
        if (this.$v.permDescription.$dirty) {
            if (!this.$v.permDescription.printableAsciiOnly) {
                errors.push( 'Permission Description can contain only printable ascii characters' );
            }
        }
        return errors;
    }

    get permCategoryErrors() {
        const errors = [];
        if (this.$v.permCategory.$dirty) {
            if (!this.$v.permCategory.required) {
                errors.push( 'Permission Category is required' );
            } else if (!this.$v.permCategory.lettersAndSpacesOnly) {
                errors.push( 'Permission Name can contain only letters and spaces' );
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

    private addPermission( payload: object ) {
        this.$store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        axios
            .post(
                process.env.VUE_APP_AUTH_URL! + '/permission', payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.user.access_key,
                    },
                })
            .then( (res) => {
                this.$store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
                if ( res.status === 200 ) {
                    this.$store.dispatch( 'notify/displayNotification', {
                        message: 'Successfully Added New Permission',
                        color: 'success',
                    }, {root: true });
                }
            })
            .catch( (error) => {
                this.$store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
                if ( error.response.status === 409 ) {
                   this.$store.dispatch( 'notify/displayNotification', {
                        message: 'Permission with this name already exists',
                        color: 'error',
                    }, {root: true });
                } else {
                    console.log(error);
                    this.$store.dispatch( 'notify/displayNotification', {
                        message: 'Unable to Add Permission',
                        color: 'error',
                    }, {root: true });
                }
            });
    }

    private convertToUpper( value: string ) {
        return value.toUpperCase();
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