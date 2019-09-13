<template>
    <div id="ace-navbar">
        <v-app-bar light short height=50 color="transparent" flat id="ace-app-bar">
            <v-app-bar-nav-icon color="grey darken-3" class="mr-n4" @click="toggleNavDrawerMinimization">
                <v-icon color="grey darken-3">{{ drawerIcon }}</v-icon>
            </v-app-bar-nav-icon>
            <v-toolbar-title class="tertiary--text font-weight-black align-self-center">
                {{ pageTitle }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text icon>
                <v-icon color="grey darken-3">mdi-bell</v-icon>
            </v-btn>
            <v-btn text icon>
                <v-icon color="grey darken-3">mdi-magnify</v-icon>
            </v-btn>
            <v-btn text icon>
                <v-icon color="grey darken-3">mdi-account-box</v-icon>
            </v-btn>
        </v-app-bar>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class NavBar extends Vue {
    private pageTitle: string | undefined = '';
    private drawerIcon: string = 'mdi-arrow-expand-left';

    @Watch( '$route' )
    private onPropertyChanged( value: object, oldValue: object ) {
        this.pageTitle = this.$route.name;
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
}
</script>
