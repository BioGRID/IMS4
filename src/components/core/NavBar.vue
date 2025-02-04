<template>
    <v-app-bar 
        light 
        absolute
        short
        dense
        color="transparent" 
        flat 
        id="ace-app-bar" 
        app
        :hide-on-scroll="true"
    >
        <v-app-bar-nav-icon color="grey darken-3" class="mr-n4" @click="toggleNavDrawerMinimization">
            <v-icon color="grey darken-3">{{ drawerIcon }}</v-icon>
        </v-app-bar-nav-icon>
        <v-toolbar-title class="align-self-center">
            <span class='grey--text text--darken-3 font-weight-black'>{{ pageTitle }}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text icon>
            <v-icon color="grey darken-3">mdi-magnify</v-icon>
        </v-btn>
        <v-btn text icon>
            <v-icon color="grey darken-3">mdi-bell</v-icon>
        </v-btn>
        <v-menu
            left
            bottom
            dark
            nudge-bottom="40"
        >
            <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                    <v-icon color="grey darken-3">mdi-settings</v-icon>
                </v-btn>
            </template>

            <v-list dense>
                <v-list-item
                    v-for="(link, i) in settingsMenuLinks"
                    :key="i"
                    :to="link.to"
                >
                    
                    <v-list-item-content>
                        <v-list-item-title v-text="link.text" /> 
                    </v-list-item-content>
                    <v-list-item-icon>
                        <v-icon v-text="link.icon"></v-icon>
                    </v-list-item-icon>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-app-bar>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
// import PermissionMixin from '@/mixins/Permission';
import { canAccess, isPermitted } from '@/utils/Permission';

@Component
export default class NavBar extends Vue {
    private pageTitle: string | undefined | null = '';
    private drawerIcon: string = 'mdi-arrow-expand-left';
    private settingsMenuLinks: object[] = [{
        to: '/admin/user/changemypassword',
        icon: 'mdi-lock-reset',
        text: 'Change Password',
    }, {
        to: '/pages/login',
        icon: 'mdi-logout',
        text: 'Logout',
    }];

    @Watch( '$route' )
    private onPropertyChanged( value: object, oldValue: object ) {
        this.pageTitle = this.$route.name;
    }

    private created() {
        this.appendLinks();
    }

    private mounted() {
       this.pageTitle = this.$route.name;
    }

    private toggleNavDrawerMinimization() {
        this.$store.dispatch( 'toggleNavDrawerMinimization' );
        if ( this.$store.state.navDrawerMinimized ) {
            this.drawerIcon = 'mdi-arrow-expand-right';
        } else {
           this.drawerIcon = 'mdi-arrow-expand-left';
        }
    }

    private appendLinks() {
        if (canAccess()) {
            if (isPermitted('VIEW ADMIN TOOLS')) {
                this.settingsMenuLinks.unshift({
                    to: '/elements/admin',
                    icon: 'mdi-lock',
                    text: 'Admin Tools',
                });
            }
        }
    }
}
</script>
