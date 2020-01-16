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
            <h1>Edit User <v-icon color="info" large>mdi-account-edit</v-icon></h1>
            <div class="subtitle-1">Use the following form to edit an existing user. Fill in the fields, and click the button.</div>
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
                                        label="Select a User to Edit" 
                                        :items="userOptions"
                                        dark
                                        required
                                        dense
                                        @change="initializeFieldValues()"
                                        v-model="userID"
                                    />
                                </v-col>
                            </v-row>
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
                                    <v-select
                                        label="User Class" 
                                        :items="permissionLevelOptions"
                                        dark
                                        required
                                        dense
                                        v-model.trim="userClass"
                                    />
                                </v-col>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-select
                                        label="User Status" 
                                        :items="userStatusOptions"
                                        dark
                                        required
                                        dense
                                        v-model.trim="userStatus"
                                    />
                                </v-col>
                            </v-row>
                        <v-btn 
                            @click="submitUser"
                            size="x-large"
                            color="success"
                            :disabled="isInvalid"
                            dark
                        >Submit Changes</v-btn>
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
import { printableAsciiOnly, lettersAndSpacesOnly } from '@/utils/Validators';
import { generateValidationError } from '@/utils/ValidationErrors';
import { convertPermissionLevelToInteger } from '@/utils/Permission.ts';
import { API_USER_UPDATE } from '@/apis/auth/User';

const auth = namespace( 'auth' );

@Component
export default class UserEdit extends Vue {
    @auth.State private user!: any;
    @auth.State private users!: any;
    @auth.State private permissionLevels!: any;
    private userID: number = 0;
    private userName: string = '';
    private userEmail: string = '';
    private userFirstName: string = '';
    private userLastName: string = '';
    private userClass: string = 'observer';
    private userStatus: string = 'active';
    private userPermissionLevel: number = 0;
    private userStatusOptions: object[] = [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
    ];

    public created() {
        this.userPermissionLevel = convertPermissionLevelToInteger(this.user.class);
        this.userID = Number(this.$route.params.id);
        this.initializeFieldValues();
    }

    @Watch( 'userName' )
    private onUsernameChanged() {
        this.userName = this.userName.toLowerCase();
    }

    private initializeFieldValues() {
        const userInfo = this.users[this.userID];
        this.userID = userInfo.id;
        this.userName = userInfo.name;
        this.userEmail = userInfo.email;
        this.userFirstName = userInfo.first_name;
        this.userLastName = userInfo.last_name;
        this.userClass = userInfo.class;
        this.userStatus = userInfo.status;
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

    get isInvalid() {
        return this.$v.$invalid;
    }

    private submitUser( ) {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            this.updateUserData({
                id: this.userID,
                name: this.userName,
                password: '',
                first_name: this.userFirstName,
                last_name: this.userLastName,
                email: this.userEmail,
                class: this.userClass,
                status: this.userStatus,
                password_reset: 0,
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

    private updateUserData( payload: object ) {
        API_USER_UPDATE( payload, this.userID, () => {
            Vue.prototype.$socket.sendObj({
                target: 0,
                namespace: 'auth',
                mutation: '',
                action: 'fetch_users',
            });
        });
    }

    private validations() {
        return {
            userName: { required, printableAsciiOnly },
            userEmail: { required, email },
            userFirstName: { required, printableAsciiOnly },
            userLastName: { required, printableAsciiOnly },
        };
    }
}

</script>

<style lang="scss" scoped>
</style>