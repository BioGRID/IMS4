<template>
    <div id="curation-group-manager">
        <v-container fluid class='pt-0'>
            <v-btn 
                class='float-right mt-4'
                small
                color='primary'
                to='/elements/admin'
                dark
            >< Back</v-btn>
            <h1>Curation Group Manager</h1>
            <div class="subtitle-1">Use the following table to manage the existing list of curation groups. Use the links in the 'tools' column to make changes to existing curation groups, and use the 'add new curation group' button to create a new one.</div>
 
            <v-btn 
                class='mt-4'
                small
                color='green darken-2'
                to='/admin/curationgroup/curationgroupadd'
                dark
                :ripple="true"
            >
                Add New Curation Group
                <v-icon class='ml-2'>mdi-account-group</v-icon>
            </v-btn>

            <ACEDataTable
                class='mt-5'
                title="Current Curation Groups"
                tableClass="pa-1"
                :columns="curationGroupTableHeaders"
                :rows="curationGroupList"
                :rowsPerPage="100"
                :totalRows="curationGroupCount"
                :pagination="true"
                :showSearch="true"
            >
                <template slot-scope="{ row }">
                    <td class='text-center'>{{ row.curation_group_id }}</td>
                    <td class='text-left' nowrap>{{ row.name }}</td>
                    <td class='text-left'>{{ row.description }}</td>
                    <td class='text-left' nowrap>{{ row.organisms }}</td>
                    <td class='text-left'>{{ row.users }}</td>
                    <td class='nowrap text-center'>
                        <v-btn 
                            x-small 
                            dark 
                            fab 
                            elevation="0" 
                            color="info" 
                            :title='"Edit curation group: " + row.name' 
                            :to="'/admin/curationgroup/curationgroupedit/' + row.curation_group_id"
                        >
                            <v-icon>mdi-account-edit</v-icon>
                        </v-btn>
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
import { CurationGroupEntry } from '@/models/curation/CurationGroup';
import ACEDataTable from '@/components/data/ACEDataTable.vue';

const auth = namespace( 'auth' );
const curation = namespace( 'curation' );
const annotation = namespace( 'annotation' );

@Component({
    components: {
        ACEDataTable,
    },
})
export default class CurationGroupManager extends Vue {
    @auth.State private users!: any;
    @curation.State private curationGroups!: any;
    @annotation.State private organisms!: any;
    private curationGroupList: object[] = [];
    private curationGroupTableHeaders: object[] = [
        {
            title: 'ID',
            field: 'curation_group_id',
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
            sortOrder: 1,
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
            title: 'Organism List',
            field: 'organisms',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Organism List',
            sortDirection: '',
            sortOrder: 0,
            className: 'text-left',
        },
        {
            title: 'User List',
            field: 'users',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'User List',
            sortDirection: '',
            sortOrder: 0,
            className: 'text-left',
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

    private created() {
        this.generateCurationGroupList();
    }

    @Watch('curationGroups')
    private onCurationGroupsChanged() {
        this.generateCurationGroupList();
    }

    private generateCurationGroupList() {
        let curationGroup: any;
        for ( curationGroup of Object.values(this.curationGroups)) {
            this.curationGroupList.push({
                curation_group_id: curationGroup.curation_group_id,
                name: curationGroup.name,
                description: curationGroup.description,
                organisms: this.formatOrganisms(curationGroup.organisms),
                users: this.formatUsers(curationGroup.users),
            });
        }
    }

    get curationGroupCount() {
        return this.curationGroupList.length;
    }

    private formatUsers(users: number[]) {
        const userList: string[] = [];
        for (const user of users) {
            const currentUser = this.users[user];
            userList.push(currentUser.name);
        }
        return userList.join( ', ' );
    }

    private formatOrganisms(organisms: number[]) {
        const orgList: string[] = [];
        for (const organism of organisms) {
            orgList.push(this.organisms[organism].abbreviation);
        }
        return orgList.join( ', ' );
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