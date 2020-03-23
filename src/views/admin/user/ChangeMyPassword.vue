<template>
    <div id="user-editor">
        <v-container fluid class='pt-0'>
            <h1>Change My Password <v-icon color="warning" large>mdi-lock-reset</v-icon></h1>
            <div class="subtitle-1">Use the following form to change your password. You will be logged out upon completion.</div>
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
import { required, minLength, sameAs } from 'vuelidate/lib/validators';
import { State, namespace } from 'vuex-class';
import { passwordComplexity } from '@/utils/Validators';
import { generateValidationError } from '@/utils/ValidationErrors';
import { API_USER_UPDATE } from '@/models/auth/User';

const auth = namespace( 'auth' );

@Component
export default class ChangeMyPassword extends Vue {
    @auth.State private user!: any;
    @auth.State private minPasswordLength!: number;
    private userPassword: string = '';
    private userPasswordRepeat: string = '';

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
            const userInfo = this.user;
            this.changePassword({
                id: userInfo.id,
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

    private async changePassword( payload: object ) {
        const status = await API_USER_UPDATE( payload, this.user.id );
        if (status) {
            this.$router.push({ name: 'Login' });
        }
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