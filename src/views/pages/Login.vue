<template>
    <v-container fill-height>
        <v-layout row wrap align-center>
            <v-flex class="text-center">
                <v-card outlined width="800" height="320" class="mx-auto" raised>
                    <v-row>
                        <v-col sm="6" class="pr-0 pt-0 pb-0">
                            <v-card flat class="mx-auto ml-0">
                                <v-img
                                    height="319px"
                                    src="@/assets/login_highlight.jpg"
                                />
                            </v-card>
                        </v-col>
                        <v-col sm="6">
                            <v-card flat class="text-left mr-3" style="height: 295px">
                                <v-row>
                                    <v-col sm="12">
                                        <h1 class='title font-weight-condensed'>Login to {{ shortTitle }}</h1>
                                        <p class='subtitle-2'>Welcome Back, please login to your account...</p>
                                        <v-form>
                                            <v-text-field 
                                                label="name"
                                                :error-messages="nameErrors"
                                                prepend-inner-icon="mdi-clipboard-account"
                                                class="login-field"
                                                v-model.trim="name"
                                                required
                                                v-on:keyup.enter="login"
                                                @input="$v.name.$touch()"
                                                @blur="$v.name.$touch()"
                                            />
                                            <v-text-field 
                                                label="password" 
                                                :error-messages="passwordErrors"
                                                type="password"
                                                prepend-inner-icon="mdi-lock-question"
                                                required
                                                class="login-field"
                                                v-model.trim="password"
                                                v-on:keyup.enter="login"
                                                @input="$v.password.$touch()"
                                                @blur="$v.password.$touch()"
                                            />
                                            <v-btn 
                                                @click="login"
                                                size="x-large"
                                                color="primary"
                                                :disabled="isInvalid"
                                            >Login</v-btn>
                                        </v-form>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { required } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';

const auth = namespace( 'auth' );

@Component
export default class Login extends Vue {
    private shortTitle: string = process.env.VUE_APP_SHORT_TITLE || 'BioGRID ACE';
    private name: string = 'stark';
    private password: string = 'biogridacefirstlogin';
    @auth.State private user!: any;

    public created() {
        if (this.user !== undefined) {
            this.$store.dispatch( 'auth/logout', {
                user: this.user,
            });
        }
    }

    get nameErrors() {
        const errors = [];
        if (this.$v.name.$dirty) {
            if (!this.$v.name.required) {
                errors.push( 'Name is required.' );
            }
        }
        return errors;
    }

    get passwordErrors() {
        const errors = [];
        if (this.$v.password.$dirty) {
            if (!this.$v.password.required) {
                errors.push( 'Password is required.' );
            }
        }
        return errors;
    }

    get isInvalid() {
        return this.$v.$invalid;
    }

    private login( ) {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            this.$store.dispatch( 'auth/login', {
                userDetails: {
                    name: this.name,
                    password: this.password,
                },
            });
        }
    }

    private validations() {
        return {
            name: { required },
            password: { required },
        };
    }

}

</script>

<style lang="scss" scoped>

</style>