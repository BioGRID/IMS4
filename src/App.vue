<template>
    <v-app>
        <router-view />
    </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class App extends Vue {}

</script>
