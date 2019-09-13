<template>
    <v-app>
        <v-content class="grey lighten-4 wavybg">
            <v-fade-transition mode="out-in">
                <router-view />
            </v-fade-transition>
        </v-content>
    </v-app>
</template>

<style lang="scss" scoped>
.wavybg {
    background-image: url( '../assets/wavy_background.jpg' );
    background-repeat: no-repeat;
    background-position: 0 0;
}
</style>