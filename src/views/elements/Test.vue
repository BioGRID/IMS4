<template>
    <div id="test-page">
        <v-container fluid class='pt-0'>
            <h1>This is a Test Page.</h1>
            <p>I can only be seen by someone with <strong>MANAGE USERS</strong> permission! Otherwise, I get permission denied!</p>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Test extends Vue {

}

</script>