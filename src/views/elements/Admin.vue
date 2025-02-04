<template>
    <div id="admin-tools">
        <v-container fluid class='pt-0'>
            <h1>Admin Tools</h1>
            <p>Select from the following set of administration tools.</p>
            <v-row>
                <v-col 
                    v-for="(tool, i) in adminToolsList"
                    :key="i"
                    v-if="canViewTool(tool.permission_name)"
                    cols="12"
                    xl="6"
                    lg="6"
                    md="6"
                    sm="6"
                    xs="12"
                >
                    <v-card
                        class="pa-1"
                        tile
                        title
                        :to="tool.to"
                    >
                        <v-icon 
                            class="float-right pa-3" 
                            large
                            :color="tool.color"
                        >
                            {{ tool.icon }}
                        </v-icon>
                        
                        <v-card-title class="pb-0 mb-0">
                            {{ tool.title }}
                        </v-card-title>
                        <v-card-text class="pb-0 mb-0">
                            {{ tool.desc }}
                        </v-card-text>
                        <v-card-actions>
                            <v-btn
                                :color="tool.color"
                                small
                                dark
                                class="ml-2"
                            >
                                Use Tool
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { isPermitted } from '@/utils/Permission.ts';

interface ACEAdminTool {
    to: string;
    icon: string;
    color: string;
    title: string;
    desc: string;
    permission_name: string;
}

@Component
export default class Admin extends Vue {
    private adminToolsList: ACEAdminTool[] = [{
        to: '/admin/permission/permissionmanager',
        icon: 'mdi-account-badge',
        color: 'deep-purple lighten-1',
        title: 'Permission Manager',
        desc: 'Add or edit global permission settings and user classes assigned to those permissions.',
        permission_name: 'MANAGE PERMISSIONS',
    },
    {
        to: '/admin/user/usermanager',
        icon: 'mdi-account-star',
        color: 'green darken-3',
        title: 'User Manager',
        desc: 'Add or edit users and modify their permission levels for access within the application.',
        permission_name: 'MANAGE USERS',
    },
    {
        to: '/admin/curationgroup/curationgroupmanager',
        icon: 'mdi-account-group',
        color: 'cyan darken-3',
        title: 'Curation Group Manager',
        desc: 'Add or edit curation groups and associated default organisms and users with permission to curate.',
        permission_name: 'MANAGE CURATION GROUPS',
    },
    {
        to: '/admin/socket/socketstatus',
        icon: 'mdi-lan-connect',
        color: 'orange darken-3',
        title: 'Socket Status',
        desc: 'Check to see the current status of the Websocket connection to the curation API. You can also test it here with an echo.',
        permission_name: 'WEBSOCKET MANAGE',
    },
    {
        to: '/admin/chemical/chemicalmanager',
        icon: 'mdi-chemical-weapon',
        color: 'pink darken-3',
        title: 'Chemical Manager',
        desc: 'Add, edit or check the current status of chemicals.',
        permission_name: 'MANAGE CHEMICALS',
    }];

    private canViewTool( permissionName: string ) {
        if (isPermitted( permissionName )) {
            return true;
        }

        return false;
    }
}

</script>