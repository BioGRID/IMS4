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
                class="mt-2 pa-0"
            >
                <v-icon color="deep-purple lighten-1" x-large class="float-right pa-3">mdi-account-badge</v-icon>
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
            <ACEDataTable
                class='mt-5'
                title="Current Permissions"
                tableClass="pa-1 smallFont"
                :columns="permissionTableHeaders"
                :rows="permissionList"
                :rowsPerPage="100"
                :totalRows="permissionCount"
                :pagination="true"
                :showSearch="true"
            >
                <template slot-scope="{ row }">
                    <td class='text-center'>{{ row.id }}</td>
                    <td class='text-left'>{{ row.name }}</td>
                    <td class='text-left'>{{ row.description }}</td>
                    <td class='text-center'>{{ row.category }}</td>
                    <td class='nowrap text-left'>
                        <v-select 
                            label="Permission Level" 
                            :items="permLevels"
                            light
                            required
                            dense
                            :attach="false"
                            :hide-details="true"
                            solo
                            :value="row.level"
                            @change="updatePermission( row.name, $event )"
                            class="pa-1"
                        />
                    </td>
                </template>

            </ACEDataTable>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { required } from 'vuelidate/lib/validators';
import { State, namespace } from 'vuex-class';
import { printableAsciiOnly, lettersAndSpacesOnly } from '@/utils/Validators';
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
    @auth.State private permissions!: any;
    private permName: string = '';
    private permDescription: string = '';
    private permCategory: string = '';
    private permLevel: string = 'observer';
    private permissionTableHeaders: object[] = [
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
            title: 'Name',
            field: 'name',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Name',
            sortDirection: 'asc',
            sortOrder: 2,
            className: 'text-left',
        },
        {
            title: 'Description',
            field: 'description',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Description',
            sortDirection: '',
            sortOrder: 0,
            className: 'text-left',
        },
        {
            title: 'Category',
            field: 'category',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Category',
            sortDirection: 'asc',
            sortOrder: 1,
            className: 'text-center',
        },
        {
            title: 'Permission Setting',
            field: 'permission',
            sortable: false,
            searchable: true,
            searchType: 'Text',
            searchName: 'Permission Setting',
            sortDirection: '',
            sortOrder: 0,
            className: 'nowrap text-left',
        },
    ];
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

    get permissionList() {
        return Object.values(this.permissions);
    }

    get permissionCount() {
        return Object.keys(this.permissions).length;
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
                    Vue.prototype.$socket.sendObj({
                        target: 0,
                        namespace: 'auth',
                        mutation: '',
                        action: 'fetch_permissions',
                    });
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

    private updatePermission( permissionName: number, permissionSetting: string ) {
        this.$store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
        const currentPerm = this.permissions[permissionName];
        if (currentPerm.level !== permissionSetting) {
            console.log( 'CHANGING PERMISSION' );
            axios
                .put(
                    process.env.VUE_APP_AUTH_URL! + '/permission/' + currentPerm.id, {
                        name: currentPerm.name,
                        description: currentPerm.description,
                        category: currentPerm.category,
                        level: permissionSetting,
                    }, {
                        headers: {
                            Authorization: 'Bearer ' + this.user.access_key,
                        },
                    })
                .then( (res) => {
                    this.$store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
                    if ( res.status === 200 ) {
                        this.$store.dispatch( 'notify/displayNotification', {
                            message: 'Successfully Updated Permission Level',
                            color: 'success',
                        }, {root: true });
                        Vue.prototype.$socket.sendObj({
                            target: 0,
                            namespace: 'auth',
                            mutation: '',
                            action: 'fetch_permissions',
                        });
                    }
                })
                .catch( (error) => {
                    this.$store.dispatch( 'toggleLoadingOverlay', {}, {root: true} );
                    console.log(error);
                    this.$store.dispatch( 'notify/displayNotification', {
                        message: 'Unable to Update Permission',
                        color: 'error',
                    }, {root: true });
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

<style lang="scss" scoped>
    table {
        tr {
            td {
                padding: 5px;
            }
        }
    }
</style>