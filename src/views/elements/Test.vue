<template>
    <div id="test-page">
        <v-container fluid class='pt-0'>
            <h1>This is a Test Page.</h1>
            <p>I can only be seen by someone with <strong>MANAGE USERS</strong> permission! Otherwise, I get permission denied!</p>

            <ACEDataTable
                title="Test Data Table"
                :columns="columnDefinitions"
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
    get columnDefinitions() {
        return [
            {
                title: 'ID',
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
                sortable: true,
                searchable: true,
                searchType: 'Text',
                searchName: 'Name',
                sortDirection: '',
                sortOrder: 0,
                className: 'text-center',
            },
            {
                title: 'Description',
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