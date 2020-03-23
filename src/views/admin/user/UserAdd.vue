<template>
    <div id="user-editor">
        <v-container fluid class='pt-0'>
            <v-btn 
                class='float-right mt-4'
                small
                color='primary'
                to='/admin/user/usermanager'
                dark
            >< Back</v-btn>
            <h1>Add New User <v-icon color="green darken-3" large class="">mdi-account-plus</v-icon></h1>
            <div class="subtitle-1">Use the following form to add a new user. Fill in the fields, and click the 'Add New User' button.</div>
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
                                        label="Username"
                                        :error-messages="userNameErrors"
                                        dark
                                        required
                                        dense
                                        v-model.trim="userName"
                                        @input="$v.userName.$touch()"
                                        @blur="$v.userName.$touch()"
                                    />
                                </v-col>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-text-field 
                                        label="Email" 
                                        :error-messages="userEmailErrors"
                                        dark
                                        required
                                        dense
                                        v-model.trim="userEmail"
                                        @input="$v.userEmail.$touch()"
                                        @blur="$v.userEmail.$touch()"
                                    />
                                </v-col>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-text-field 
                                        label="First Name"
                                        :error-messages="userFirstNameErrors"
                                        dark
                                        required
                                        dense
                                        v-model.trim="userFirstName"
                                        @input="$v.userFirstName.$touch()"
                                        @blur="$v.userFirstName.$touch()"
                                    />
                                </v-col>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-text-field 
                                        label="Last Name" 
                                        :error-messages="userLastNameErrors"
                                        dark
                                        required
                                        dense
                                        v-model.trim="userLastName"
                                        @input="$v.userLastName.$touch()"
                                        @blur="$v.userLastName.$touch()"
                                    />
                                </v-col>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-text-field 
                                        label="Password"
                                        :error-messages="userPasswordErrors"
                                        dark
                                        required
                                        type="password"
                                        dense
                                        v-model.trim="userPassword"
                                        @input="$v.userPassword.$touch()"
                                        @blur="$v.userPassword.$touch()"
                                    />
                                </v-col>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-text-field 
                                        label="Password Repeat"
                                        :error-messages="userPasswordRepeatErrors"
                                        dark
                                        required
                                        type="password"
                                        dense
                                        v-model.trim="userPasswordRepeat"
                                        @input="$v.userPasswordRepeat.$touch()"
                                        @blur="$v.userPasswordRepeat.$touch()"
                                    />
                                </v-col>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-select
                                        label="User Class" 
                                        :items="permissionLevelOptions"
                                        dark
                                        required
                                        dense
                                        v-model.trim="userClass"
                                    />
                                </v-col>
                            </v-row>
                        <v-btn 
                            @click="submitUser"
                            size="x-large"
                            color="success"
                            dark
                            :disabled="isInvalid"
                        >Add New User</v-btn>
                        </v-form>
                    </v-sheet>
                </v-card-text>
            </v-card>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';
import { State, namespace } from 'vuex-class';
import { printableAsciiOnly, lettersAndSpacesOnly, passwordComplexity } from '@/utils/Validators';
import { generateValidationError } from '@/utils/ValidationErrors';
import { convertPermissionLevelToInteger } from '@/utils/Permission.ts';
import { API_USER_ADD } from '@/models/auth/User';

const auth = namespace( 'auth' );

@Component
export default class UserAdd extends Vue {
    @auth.State private user!: any;
    @auth.State private users!: any;
    @auth.State private permissionLevels!: any;
    @auth.State private minPasswordLength!: number;
    private userName: string = '';
    private userEmail: string = '';
    private userFirstName: string = '';
    private userLastName: string = '';
    private userPassword: string = '';
    private userPasswordRepeat: string = '';
    private userClass: string = 'observer';
    private userPermissionLevel: number = 0;

    public created() {
        this.userPermissionLevel = convertPermissionLevelToInteger(this.user.class);
    }

    @Watch( 'userName' )
    private onUsernameChanged() {
        this.userName = this.userName.toLowerCase();
    }

    get userNameErrors() {
        const errors = [];
        if (this.$v.userName.$dirty) {
            if (!this.$v.userName.required) {
                errors.push( generateValidationError( 'required', 'Username', null ) );
            } else if (!this.$v.userName.printableAsciiOnly) {
                errors.push( generateValidationError( 'printableAsciiOnly', 'Username', null ) );
            }
        }
        return errors;
    }

    get userEmailErrors() {
        const errors = [];
        if (this.$v.userEmail.$dirty) {
            if (!this.$v.userEmail.required) {
                errors.push( generateValidationError( 'required', 'Email', null ) );
            } else if (!this.$v.userEmail.email) {
                errors.push( generateValidationError( 'email', 'Email', null ) );
            }
        }
        return errors;
    }

    get userFirstNameErrors() {
        const errors = [];
        if (this.$v.userFirstName.$dirty) {
            if (!this.$v.userFirstName.required) {
                errors.push( generateValidationError( 'required', 'First Name', null ) );
            } else if (!this.$v.userFirstName.printableAsciiOnly) {
                errors.push( generateValidationError( 'printableAsciiOnly', 'First Name', null ) );
            }
        }
        return errors;
    }

    get userLastNameErrors() {
        const errors = [];
        if (this.$v.userLastName.$dirty) {
            if (!this.$v.userLastName.required) {
                errors.push( generateValidationError( 'required', 'Last Name', null ) );
            } else if (!this.$v.userLastName.printableAsciiOnly) {
                errors.push( generateValidationError( 'printableAsciiOnly', 'Last Name', null ) );
            }
        }
        return errors;
    }

    get userPasswordErrors() {
        const errors = [];
        if (this.$v.userPassword.$dirty) {
            if (!this.$v.userPassword.required) {
                errors.push( generateValidationError( 'required', 'Password', null ) );
            } else if (!this.$v.userPassword.minLength) {
                errors.push( generateValidationError( 'minlength', 'Password', this.minPasswordLength.toString() ) );
            } else if (!this.$v.userPassword.passwordComplexity) {
                errors.push( generateValidationError( 'passwordcomplexity', 'Password', null ) );
            }
        }
        return errors;
    }

    get userPasswordRepeatErrors() {
        const errors = [];
        if (this.$v.userPasswordRepeat.$dirty) {
            if (!this.$v.userPasswordRepeat.required) {
                errors.push( generateValidationError( 'required', 'Password Repeat', null ) );
            } else if (!this.$v.userPasswordRepeat.sameAs) {
                errors.push( generateValidationError( 'sameas', 'Password Repeat', 'Password' ) );
            }
        }
        return errors;
    }

    get isInvalid() {
        return this.$v.$invalid;
    }

    private submitUser( ) {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            this.addUser({
                name: this.userName,
                password: this.userPassword,
                first_name: this.userFirstName,
                last_name: this.userLastName,
                email: this.userEmail,
                class: this.userClass,
                password_reset: 1,
            });
        }
    }

    get permissionLevelOptions() {
        return Object.values(this.permissionLevels).filter( (item: any) => {
            const classLevel = convertPermissionLevelToInteger(item.value);
            if (this.userPermissionLevel >= classLevel) {
                return true;
            }
        });
    }

    private async addUser( payload: object ) {
        const status = await API_USER_ADD( payload );
        if (status) {
            Vue.prototype.$socket.sendObj({
                target: 0,
                namespace: 'auth',
                mutation: '',
                action: 'fetch_users',
            });
        }
    }

    private validations() {
        return {
            userName: { required, printableAsciiOnly },
            userEmail: { required, email },
            userFirstName: { required, printableAsciiOnly },
            userLastName: { required, printableAsciiOnly },
            userPassword: { required, minLength: minLength(this.minPasswordLength), passwordComplexity },
            userPasswordRepeat: { required, sameAs: sameAs( 'userPassword' ) },
        };
    }
}

</script>

<style lang="scss" scoped>
</style>