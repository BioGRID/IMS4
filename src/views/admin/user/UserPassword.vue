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
            <h1>Change User Password <v-icon color="warning" large>mdi-lock-reset</v-icon></h1>
            <div class="subtitle-1">Use the following form to change a user's password. You will need to remember the pasword entered, in order to give it to the user being modified, or they will be unable to login.</div>
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
                                <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12">
                                    <v-select
                                        label="Select a User" 
                                        :items="userOptions"
                                        dark
                                        required
                                        dense
                                        v-model="userID"
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12">
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
                                <v-col cols="12" xl="12" lg="12" md="12" sm="12" xs="12">
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
                            </v-row>
                        <v-btn 
                            @click="submitUser"
                            size="x-large"
                            color="success"
                            :disabled="isInvalid"
                            dark
                        >Change Password</v-btn>
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
import { API_USER_UPDATE } from '@/apis/auth/User';

const auth = namespace( 'auth' );

@Component
export default class UserPassword extends Vue {
    @auth.State private user!: any;
    @auth.State private users!: any;
    @auth.State private permissionLevels!: any;
    @auth.State private minPasswordLength!: number;
    private userID: number = 0;
    private userPassword: string = '';
    private userPasswordRepeat: string = '';
    private userPermissionLevel: number = 0;

    public created() {
        this.userPermissionLevel = convertPermissionLevelToInteger(this.user.class);
        this.userID = Number(this.$route.params.id);
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
            const userInfo = this.users[this.userID];
            this.changePassword({
                id: this.userID,
                name: userInfo.name,
                password: this.userPassword,
                first_name: userInfo.first_name,
                last_name: userInfo.last_name,
                email: userInfo.email,
                class: userInfo.class,
                status: userInfo.status,
                password_reset: 0,
            });
        }
    }

    get userOptions() {
        const userList: any[] = Object.values(this.users).filter( (item: any) => {
            const classLevel = convertPermissionLevelToInteger(item.class);
            if (this.userPermissionLevel >= classLevel) {
                return true;
            }
        });

        const userOptions: object[] = [];
        for (const user of userList) {
            userOptions.push( { text: user.id + ': ' + user.name, value: user.id } );
        }

        return userOptions;
    }

    get permissionLevelOptions() {
        return Object.values(this.permissionLevels).filter( (item: any) => {
            const classLevel = convertPermissionLevelToInteger(item.value);
            if (this.userPermissionLevel >= classLevel) {
                return true;
            }
        });
    }

    private changePassword( payload: object ) {
        API_USER_UPDATE( payload, this.userID, () => {
            Vue.prototype.$socket.sendObj({
                target: 0,
                namespace: 'auth',
                mutation: '',
                action: 'fetch_users',
            });
            Vue.prototype.$socket.sendObj({
                target: this.userID,
                namespace: 'auth',
                mutation: '',
                action: 'force_logout',
            });
        });
    }

    private validations() {
        return {
            userPassword: { required, minLength: minLength(this.minPasswordLength), passwordComplexity },
            userPasswordRepeat: { required, sameAs: sameAs( 'userPassword' ) },
        };
    }
}

</script>

<style lang="scss" scoped>
</style>