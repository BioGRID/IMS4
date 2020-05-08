<template>
    <v-app>
        <TitleBar />
        <v-content class="grey lighten-4 wavybg" app>
            <v-fade-transition mode="out-in">
                <router-view />
            </v-fade-transition>
        </v-content>
        <NotifyBar />
        <LoadingOverlay />
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LoadingOverlay from '@/components/core/LoadingOverlay.vue';
import NotifyBar from '@/components/core/NotifyBar.vue';
import TitleBar from '@/components/core/TitleBar.vue';

@Component({
    components: {
        LoadingOverlay,
        NotifyBar,
        TitleBar,
    },
})
export default class FullPageVue extends Vue {}
</script>

<style lang="scss" scoped>
.wavybg {
    background-image: url( '../assets/wavy_background.jpg' );
    background-repeat: no-repeat;
    background-position: 0 0;
}
</style>