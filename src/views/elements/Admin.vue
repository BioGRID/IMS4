<template>
    <div id="admin-tools">
        <v-container fluid class='pt-0'>
            <h1>Admin Tools</h1>
            <p>Select from the following set of administration tools.</p>
            <v-row>
                <v-col 
                    v-for="(tool, i) in adminToolsList"
                    :key="i"
                    cols="12"
                    xl="2"
                    lg="3"
                    md="4"
                    sm="6"
                    xs="12"
                >
                    <v-card
                        class="pa-1"
                        shaped
                        title
                        :to="tool.to"
                    >
                        <v-icon 
                            class="float-right pa-3" 
                            large
                            :color="tool.tool_color"
                        >
                            {{ tool.icon }}
                        </v-icon>
                        
                        <v-card-title>
                            {{ tool.title }}
                        </v-card-title>
                        <v-card-text>
                            {{ tool.desc }}
                        </v-card-text>
                        <v-card-actions>
                            <v-btn
                                :color="tool.tool_color"
                                small
                                dark
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

@Component
export default class Admin extends Vue {
    private adminToolsList: object[] = [{
        to: '/admin/permissions',
        icon: 'mdi-alpha-p-circle',
        tool_color: 'deep-purple lighten-1',
        title: 'Permission Manager',
        desc: 'Create/Delete/Modify global permission settings and user classes assigned to those permissions',
    }];
}

</script>