<template>
    <v-app>
        <NotifyBar />
        <LoadingOverlay />
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
import LoadingOverlay from '@/components/core/LoadingOverlay.vue';

@Component({
    components: {
        NavBar,
        NavDrawer,
        NotifyBar,
        LoadingOverlay,
    },
})
export default class MainVue extends Vue {}

</script>