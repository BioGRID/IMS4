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
                                                label="username" 
                                                prepend-inner-icon="mdi-clipboard-account"
                                                outlined
                                                class='login-field'
                                                v-model='username'
                                            />
                                            <v-text-field 
                                                label="password" 
                                                type="password"
                                                prepend-inner-icon="mdi-lock-question"
                                                outlined
                                                class='login-field'
                                                v-model='password'
                                            />
                                            <v-btn 
                                                @click="login"
                                                size="x-large"
                                                color="primary"
                                                :loading="loginAttempt"
                                                :disabled="loginAttempt"
                                            >
                                                Login
                                            </v-btn>
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

@Component
export default class Login extends Vue {
    private shortTitle: string = process.env.VUE_APP_SHORT_TITLE || 'BioGRID ACE';
    private loginAttempt: boolean = false;
    private username: string = '';
    private password: string = '';


    private login( ) {
        console.log( 'BUTTON CLICKED' );
        this.toggleLoginAttempt();
        this.$store.dispatch( 'auth/login', {
            userDetails: {
                username: this.username,
                password: this.password,
            },
        });
        setTimeout(() => {
            this.toggleLoginAttempt();
        }, 3000 );
    }

    private toggleLoginAttempt() {
        this.loginAttempt = !this.loginAttempt;
    }
}

</script>

<style lang="scss" scoped>
.login-field {
    height: 70px;
}
</style>