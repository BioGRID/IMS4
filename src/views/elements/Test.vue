<template>
    <div id="test-page">
        <v-container fluid class='pt-0'>
            <h1>This is a Test Page</h1>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Test extends Vue {}

</script>