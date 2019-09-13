<template>
    <v-navigation-drawer 
        id="ace-sidebar"
        dark 
        width="200" 
        app 
        floating
        color="light-blue darken-4"
        class="mt-6"
        permanent
        :mini-variant="navDrawerMinimized"
    >

        <v-list-item class='mt-1'>
            <v-list-item-action>
                <img
                    src='@/assets/logo_small_gold.png' 
                    height='22'
                    contain
                />
            </v-list-item-action>
            <v-list-item-title class="title ml-n5">
                <span class="font-weight-thin">{{ firstTitle }}</span><span class="font-weight-bold font-italic yellow--text text--accent-4">{{ secondTitle }}</span>
            </v-list-item-title>
        </v-list-item>

        <v-divider />
        
        <v-list dense>
            <v-list-item
                v-for="(link, i) in links"
                :key="i"
                :to="link.to"
                active-class="yellow lighten-2 black--text"
            >
                <v-list-item-action>
                    <v-icon>{{ link.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content class="ml-n5">
                    <v-list-item-title v-text="link.text" /> 
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';

@Component
export default class NavDrawer extends Vue {
    @State private navDrawerMinimized!: boolean;
    private firstTitle: string = process.env.VUE_APP_FIRST_TITLE || 'BioGRID';
    private secondTitle: string = process.env.VUE_APP_SECOND_TITLE || 'ACE';
    private links: object[] = [
        {
            to: '/',
            icon: 'mdi-view-dashboard',
            text: 'Dashboard',
        },
        {
            to: '/elements/test',
            icon: 'mdi-grill',
            text: 'Test Page',
        },
        {
            to: '/pages/login',
            icon: 'mdi-login',
            text: 'Login',
        },
        {
            to: '/nonexistant',
            icon: 'mdi-account-question',
            text: 'Error 404',
        },
    ];

}
</script>