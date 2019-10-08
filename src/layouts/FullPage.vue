<template>
    <v-app>
        <NotifyBar />
        <LoadingOverlay />
        <v-content class="grey lighten-4 wavybg">
            <v-fade-transition mode="out-in">
                <router-view />
            </v-fade-transition>
        </v-content>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NotifyBar from '@/components/core/NotifyBar.vue';
import LoadingOverlay from '@/components/core/LoadingOverlay.vue';

@Component({
    components: {
        NotifyBar,
        LoadingOverlay,
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