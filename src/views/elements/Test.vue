<template>
    <div id="test-page">
        <v-container fluid class='pt-0'>
            <h1>This is a Test Page.</h1>
            <p>I can only be seen by someone with <strong>MANAGE USERS</strong> permission! Otherwise, I get permission denied!</p>

            <ACEDataTable
                title="Test Data Table"
                :columns="columnDefinitions"
                :rows="tableRows"
                :maxRows="3"
                :pagination="true"
            ></ACEDataTable>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ACEDataTable from '@/components/data/ACEDataTable.vue';

@Component({
    components: {
        ACEDataTable,
    },
})
export default class Test extends Vue {

    get tableRows() {
        return [
            {
                id: 1,
                name: 'ADD USER',
                description: 'Permission to add a new user to the system',
                category: 'ADMIN',
                permission: 'POWER USER',
            },
            {
                id: 8,
                name: 'GET PERMISSIONS',
                description: 'Get a listing of existing permission settings',
                category: '22',
                permission: 'POWER USER',
            },
            {
                id: 5,
                name: 'GET USER',
                description: 'Permission to get information about a user from the database',
                category: '2',
                permission: 'OBSERVER',
            },
            {
                id: 3,
                name: 'LOGOUT USER',
                description: 'Permission to logout a user',
                category: 'ABC123',
                permission: 'MANAGER',
            },
            {
                id: 2,
                name: 'MANAGE PERMISSIONS',
                description: 'Permission to access the manage permissions page and add new permissions',
                category: '456ABC',
                permission: 'ADMIN',
            },
            {
                id: 4,
                name: 'MANAGE USERS',
                description: 'Permission to manage users such as change information and deactivate accounts',
                category: '123ABC',
                permission: 'ADMIN',
            },
            {
                id: 6,
                name: 'UPDATE ANNOTATION',
                description: 'Permission to update annotation in the core annotation database.',
                category: 'ABC789',
                permission: 'MANAGER',
            },
            {
                id: 7,
                name: 'VIEW ADMIN TOOLS',
                description: 'Permission to view the listing of admin tools',
                category: 'BLAH',
                permission: 'STANDARD',
            },
            {
                id: 9,
                name: 'WEBSOCKET CONNECT',
                description: 'Create an open websocket connection',
                category: 'BANANA',
                permission: 'OBSERVER',
            },
            {
                id: 10,
                name: 'WEBSOCKET MANAGE',
                description: 'Permission to view the Socket Status Page',
                category: 'BLAH',
                permission: 'POWER USER',
            },
        ];
    }

    get columnDefinitions() {
        return [
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
                sortDirection: '',
                sortOrder: 0,
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
                sortDirection: '',
                sortOrder: 0,
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
    }
}

</script>