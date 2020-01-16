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
        to: '/admin/permissions',
        icon: 'mdi-account-badge',
        color: 'deep-purple lighten-1',
        title: 'Permission Manager',
        desc: 'Create/Delete/Modify global permission settings and user classes assigned to those permissions.',
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
        to: '/admin/socketstatus',
        icon: 'mdi-lan-connect',
        color: 'orange darken-3',
        title: 'Socket Status',
        desc: 'Check to see the current status of the Websocket connection to the curation API.',
        permission_name: 'WEBSOCKET MANAGE',
    }];

    private canViewTool( permissionName: string ) {
        if (isPermitted( permissionName )) {
            return true;
        }

        return false;
    }
}

</script>