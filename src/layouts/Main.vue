<template>
    <v-app>
        <NotifyBar />
        <v-content class="grey lighten-4">
            <div id="main-view">
                <NavDrawer />
                <NavBar />
                <v-fade-transition mode="out-in">
                    <router-view />
                </v-fade-transition>
            </div>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NavBar from '@/components/core/NavBar.vue';
import NavDrawer from '@/components/core/NavDrawer.vue';
import NotifyBar from '@/components/core/NotifyBar.vue';

@Component({
    components: {
        NavBar,
        NavDrawer,
        NotifyBar,
    },
})
export default class MainVue extends Vue {}

</script>