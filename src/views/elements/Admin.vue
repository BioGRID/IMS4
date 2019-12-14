<template>
    <div id="test-page">
        <v-container fluid class='pt-0'>
            <h1>Admin Tools</h1>
            <p>I can only be seen by someone with <strong>VIEW ADMIN TOOLS</strong> permission! Otherwise, I get permission denied!</p>
            <a href="http://google.com">TEST</a>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Test extends Vue {}

</script>