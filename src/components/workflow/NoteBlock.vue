<template>
    <div class='note-block'>
        <v-card color="grey lighten-1" height="200px">
            Note Block
        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';

@Component
export default class NoteBlock extends Vue {

}
</script>

<style lang="scss">
</style>