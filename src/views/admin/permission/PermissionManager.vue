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
            <div class="subtitle-1">Use the following table to manage the permissions used within the application. Click on items in the tools column to adjust permission settings.</div>
 
            <v-btn 
                class='mt-4'
                small
                color='green darken-2'
                to='/admin/permission/permissionadd'
                dark
                :ripple="true"
            >
                Add New Permission
                <v-icon class='ml-2'>mdi-account-badge</v-icon>
            </v-btn>

            <ACEDataTable
                class='mt-5'
                title="Current Permissions"
                tableClass="pa-1"
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
                    <td class='nowrap text-center'>
                        <v-sheet
                            dark
                            class='pa-1'
                            :color="permissionLevelColor( row.level )"
                        >
                            {{ row.level }}
                        </v-sheet>
                    </td>
                    <td class='nowrap text-center'>
                        <v-tooltip left :nudge-top="30" color="black">
                            <template v-slot:activator="{ on }">
                                <v-btn 
                                    x-small 
                                    dark 
                                    fab 
                                    elevation="0" 
                                    v-on="on" 
                                    color="info" 
                                    :to="'/admin/permission/permissionedit/' + row.name"
                                >
                                    <v-icon>mdi-file-document-edit</v-icon>
                                </v-btn>
                            </template>
                            <span>Edit Permission</span>
                        </v-tooltip>
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
import ACEDataTable from '@/components/data/ACEDataTable.vue';

const auth = namespace( 'auth' );

@Component({
    components: {
        ACEDataTable,
    },
})
export default class PermissionManager extends Vue {
    @auth.State private permissions!: any;
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
            field: 'level',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Permission Setting',
            sortDirection: '',
            sortOrder: 0,
            className: 'nowrap text-left',
        },
        {
            title: 'Tools',
            field: 'tools',
            sortable: false,
            searchable: false,
            searchType: '',
            searchName: 'Tools',
            sortDirection: '',
            sortOrder: 0,
            className: 'nowrap text-center',
        },
    ];

    get permissionList() {
        return Object.values(this.permissions);
    }

    get permissionCount() {
        return Object.keys(this.permissions).length;
    }

    private permissionLevelColor( level: string ) {
        switch (level.toLowerCase()) {
            case 'observer' : return 'orange darken-4';
            case 'standard' : return 'green darken-2';
            case 'manager' : return 'blue darken-2';
            case 'poweruser' : return 'purple darken-4';
            case 'admin' : return 'red darken-4';
            case 'default' : return 'grey darken-2';
        }
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