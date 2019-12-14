<template>
    <div id="dashboard">
        <v-container fluid class='pt-0'>
            <h1>Welcome Back <span class="highlight--text">{{ firstName }}</span>!</h1>
            <p>You are now using version <strong><span class="highlight--text">{{ appVersion }}</span></strong> of the <strong>{{ fullTitle }}</strong>. This is a private system used in curation and maintainance of the entire suite of <a href="https://thebiogrid.org/" target="_BLANK">BioGRID</a> Projects and Applications. If you are logged in by accident, please immediately <strong><a href="/pages/login" title="Logout">logout</a></strong>.</p>
            <strong>{{ userList }}</strong>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';

const auth = namespace( 'auth' );

@Component
export default class Dashboard extends Vue {
    private fullTitle: string = process.env.VUE_APP_FULL_TITLE || 'BioGRID ACE';
    private appVersion: string = process.env.VUE_APP_VERSION || '0.0.1';
    @auth.State private user!: any;
    @auth.State private users!: any;

    get fullName() {
        return this.user.first_name + ' ' + this.user.last_name;
    }

    get firstName() {
        return this.user.first_name;
    }

    get userList() {
        return this.users;
    }

}

</script>
