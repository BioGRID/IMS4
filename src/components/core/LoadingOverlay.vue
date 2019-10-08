<template>
    <div id="ace-loading-overlay">
        <v-overlay :value="loadingOverlayVisible">
            <v-progress-circular 
                indeterminate 
                color="yellow accent-4"
                size="120"
                width="10"
            >Loading</v-progress-circular>
        </v-overlay>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';

@Component
export default class LoadingOverlay extends Vue {
    @State private loadingOverlayVisible!: boolean;
}
</script>
