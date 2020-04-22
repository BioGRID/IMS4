<template>
    <v-app>
        <NotifyBar />
        <LoadingOverlay />
        <v-content class="grey lighten-3">
            <div id="main-view">
                <NavDrawer />
                <NavBar />
                <v-fade-transition mode="out-in">
                    <keep-alive include="DatasetView">
                        <router-view :key="getKey()" />
                    </keep-alive>
                </v-fade-transition>
            </div>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
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
export default class MainVue extends Vue {
    @State private pathCache!: Map<string, number>;
    private getKey() {
        // Check to see if route starts with /curation/DatasetView
        // if not, return just the path
        if (!this.$route.path.startsWith( '/curation/DatasetView' )) {
            console.log(this.$route.path);
            return this.$route.path;
        } else {
            // If it is a dataset path, check to see if path is in the
            // path cache, if not, do an increment to add it
            if (this.pathCache.get(this.$route.path) === undefined ) {
                this.$store.dispatch( 'incrementPathCache', { path: this.$route.path });
            }

            // New key is the route path + the incremented counter
            const pathAppend = this.pathCache.get(this.$route.path);
            console.log(this.$route.path + '/' + pathAppend);
            return this.$route.path + '/' + pathAppend;
        }
    }
}

</script>