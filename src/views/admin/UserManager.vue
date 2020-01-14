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
            <h1>User Manager</h1>
            <div class="subtitle-1">Use the user management form below to edit an existing user in the system. You can also use the table below to make adjustments to the access permissions assigned to individual users. <strong>Note</strong>: Users will need to logout and then log back in again for changes to be reflected in their access credentials.</div>
            <v-card
                class="mt-2 pa-0"
            >

                <v-icon color="green darken-3" x-large class="float-right pa-3">mdi-account-star</v-icon>
                <v-card-title>
                    Add New User
                </v-card-title>
                <v-card-subtitle class="pb-0">
                    Use this form to add a new user to the system. This will grant them login access to this application.
                </v-card-subtitle>

                <v-card-text>
                <v-form>
                    <v-row>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                            <v-text-field 
                                label="Username"
                                :error-messages="userNameErrors"
                                light
                                required
                                dense
                                v-model.trim="userName"
                                @input="$v.userName.$touch()"
                                @blur="$v.userName.$touch()"
                            />
                        </v-col>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                            <v-text-field 
                                label="User Email" 
                                :error-messages="userEmailErrors"
                                light
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
                                light
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
                                light
                                required
                                dense
                                v-model.trim="userLastName"
                                @input="$v.userLastName.$touch()"
                                @blur="$v.userLastName.$touch()"
                            />
                        </v-col>
                        <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                            <v-text-field 
                                label="User Password"
                                :error-messages="userPasswordErrors"
                                light
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
                                label="User Password Repeat"
                                :error-messages="userPasswordRepeatErrors"
                                light
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
                                light
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
                    :disabled="isInvalid"
                >Add New User</v-btn>
                </v-form>
                </v-card-text>
            </v-card>
            <ACEDataTable
                class='mt-5'
                title="Current Users"
                tableClass="pa-1"
                :columns="userTableHeaders"
                :rows="userList"
                :rowsPerPage="100"
                :totalRows="userCount"
                :pagination="true"
                :showSearch="true"
            >
                <template slot-scope="{ row }">
                    <td class='text-center'>{{ row.id }}</td>
                    <td class='text-left'><strong>{{ row.name }}</strong></td>
                    <td class='text-left'>{{ row.first_name }}</td>
                    <td class='text-left'>{{ row.last_name }}</td>
                    <td class='text-left'>{{ row.email }}</td>
                    <td class='nowrap text-left'>
                        <span>
                            <v-select 
                                label="User Class" 
                                :items="permissionLevelOptions"
                                light
                                required
                                dense
                                :attach="true"
                                :id="row.name"
                                :hide-details="true"
                                solo
                                :value="row.class"
                                @change="updateClass( row.id, $event )"
                                class="pa-1"
                            />
                        </span>
                    </td>
                    <td class='text-center'>
                        <template>
                            <v-btn 
                                small 
                                :color="row.status === 'active' ? 'success darken-2' : 'error darken-4'"
                                @click="updateStatus( row.id, row.status )"
                            >
                                <span class='pr-1'>{{ row.status }}</span> 
                                <v-icon small> 
                                    {{ row.status === 'active' ? 'mdi-account-check' : 'mdi-account-remove' }}
                                </v-icon>
                            </v-btn>
                        </template>
                    </td>
                </template>

            </ACEDataTable>
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
import ACEDataTable from '@/components/data/ACEDataTable.vue';
import axios from 'axios';

const auth = namespace( 'auth' );

@Component({
    components: {
        ACEDataTable,
    },
})
export default class PermissionManager extends Vue {
    @auth.State private user!: any;
    @auth.State private users!: any;
    @auth.State private permissionLevels!: any;
    private userName: string = '';
    private userEmail: string = '';
    private userFirstName: string = '';
    private userLastName: string = '';
    private userPassword: string = '';
    private userPasswordRepeat: string = '';
    private userClass: string = 'observer';
    private minPasswordLength: number = 10;
    private userPermissionLevel: number = 0;
    private userTableHeaders: object[] = [
        {
            title: 'ID',
            field: 'id',
            sortable: true,
            searchable: true,
            searchType: 'NumericRange',
            searchName: 'ID',
            sortDirection: '',
            sortOrder: 0,
            className: 'text-center',
        },
        {
            title: 'Username',
            field: 'name',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Username',
            sortDirection: 'asc',
            sortOrder: 1,
            className: 'text-left',
        },
        {
            title: 'Email',
            field: 'email',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Email',
            sortDirection: '',
            sortOrder: 0,
            className: 'text-left',
        },
        {
            title: 'First Name',
            field: 'first_name',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'First Name',
            sortDirection: '',
            sortOrder: 0,
            className: 'text-left',
        },
        {
            title: 'Last Name',
            field: 'last_name',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Last Name',
            sortDirection: '',
            sortOrder: 0,
            className: 'text-left',
        },
        {
            title: 'User Class',
            field: 'class',
            sortable: false,
            searchable: true,
            searchType: 'Text',
            searchName: 'User Class',
            sortDirection: '',
            sortOrder: 0,
            className: 'nowrap text-left',
            width: '20%',
        },
        {
            title: 'Status',
            field: 'status',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Status',
            sortDirection: '',
            sortOrder: 0,
            className: 'text-center',
        },
    ];

    public created() {
        this.userPermissionLevel = convertPermissionLevelToInteger(this.user.class);
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

    get userList() {
        return Object.values(this.users).filter( (item: any) => {
            const userClass = convertPermissionLevelToInteger(item.class);
            if (this.userPermissionLevel >= userClass) {
                return true;
            }
        });
    }

    get permissionLevelOptions() {
        return Object.values(this.permissionLevels).filter( (item: any) => {
            const classLevel = convertPermissionLevelToInteger(item.value);
            if (this.userPermissionLevel >= classLevel) {
                return true;
            }
        });
    }

    get userCount() {
        return Object.keys(this.users).length;
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

    private addUser( payload: object ) {
        this.$store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        axios
            .post(
                process.env.VUE_APP_AUTH_URL! + '/user', payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.user.access_key,
                    },
                })
            .then( (res) => {
                this.$store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
                if ( res.status === 200 ) {
                    this.$store.dispatch( 'notify/displayNotification', {
                        message: 'Successfully Added New User',
                        color: 'success',
                    }, {root: true });
                    Vue.prototype.$socket.sendObj({
                        target: 0,
                        namespace: 'auth',
                        mutation: '',
                        action: 'fetch_users',
                    });
                }
            })
            .catch( (error) => {
                this.$store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
                if ( error.response.status === 409 ) {
                   this.$store.dispatch( 'notify/displayNotification', {
                        message: 'User with this name or email already exists',
                        color: 'error',
                    }, {root: true });
                } else {
                    console.log(error);
                    this.$store.dispatch( 'notify/displayNotification', {
                        message: 'Unable to Add User',
                        color: 'error',
                    }, {root: true });
                }
            });
    }

    private updateClass( userID: number, userClass: string ) {
        this.$store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        const currentUser = this.users[userID];
        axios
            .put(
                process.env.VUE_APP_AUTH_URL! + '/user/' + userID, {
                        name: currentUser.name,
                        password: '',
                        first_name: currentUser.first_name,
                        last_name: currentUser.last_name,
                        email: currentUser.email,
                        class: userClass,
                        password_reset: currentUser.password_reset,
                        status: currentUser.status,
                    }, {
                    headers: {
                        Authorization: 'Bearer ' + this.user.access_key,
                    },
                })
            .then( (res) => {
                this.$store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
                if ( res.status === 200 ) {
                    this.$store.dispatch( 'notify/displayNotification', {
                        message: 'Successfully changed user class',
                        color: 'success',
                    }, {root: true });
                    Vue.prototype.$socket.sendObj({
                        target: 0,
                        namespace: 'auth',
                        mutation: '',
                        action: 'fetch_users',
                    });
                }
            })
            .catch( (error) => {
                this.$store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
                console.log(error);
                this.$store.dispatch( 'notify/displayNotification', {
                    message: 'Unable to Change User Class',
                    color: 'error',
                }, {root: true });
            });
    }

    private updateStatus( userID: number, currentStatus: string ) {
        this.$store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        const currentUser = this.users[userID];

        let newStatus = 'inactive';
        if (currentStatus === 'inactive') {
            newStatus = 'active';
        }

        axios
            .put(
                process.env.VUE_APP_AUTH_URL! + '/user/' + userID, {
                        name: currentUser.name,
                        password: '',
                        first_name: currentUser.first_name,
                        last_name: currentUser.last_name,
                        email: currentUser.email,
                        class: currentUser.class,
                        password_reset: currentUser.password_reset,
                        status: newStatus,
                    }, {
                    headers: {
                        Authorization: 'Bearer ' + this.user.access_key,
                    },
                })
            .then( (res) => {
                this.$store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
                if ( res.status === 200 ) {
                    this.$store.dispatch( 'notify/displayNotification', {
                        message: 'Successfully changed user to ' + newStatus,
                        color: 'success',
                    }, {root: true });
                    Vue.prototype.$socket.sendObj({
                        target: 0,
                        namespace: 'auth',
                        mutation: '',
                        action: 'fetch_users',
                    });
                }
            })
            .catch( (error) => {
                this.$store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
                console.log(error);
                this.$store.dispatch( 'notify/displayNotification', {
                    message: 'Unable to Change User Status',
                    color: 'error',
                }, {root: true });
            });
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
    table {
        tr {
            td {
                padding: 5px;
                &.userActive {
                    background-color: var(--v-success-darken2);
                    color: #FFF;
                }
                &.userInactive {
                    background-color: var(--v-error-darken4);
                    color: #FFF;
                }
            }
        }
    }
</style>