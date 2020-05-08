<template>
        <v-system-bar window dark app id="draggableRegion">
            <v-icon color="yellow accent-4" small>mdi-cards-spade</v-icon>
            <span>{{ fullTitle }}</span>
            <v-spacer></v-spacer>
            <div id="windowControls">
                <v-btn class='mr-6 pl-2' small icon @click="minimizeWindow"><v-icon>mdi-minus</v-icon></v-btn>
                <v-btn class='mr-6 pl-2' small icon @click="toggleFullscreen">
                    <v-icon>
                        {{ toggleIcon }}
                    </v-icon>
                </v-btn>
                <v-btn icon class='pl-2' small @click="closeWindow"><v-icon>mdi-close</v-icon></v-btn>
            </div>
        </v-system-bar>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { remote } from 'electron';

@Component
export default class TitleBar extends Vue {
    private fullTitle: string = process.env.VUE_APP_SHORT_TITLE || 'BioGRID ACE';
    private currentWindow: any;
    private toggleIcon: string = 'mdi-dock-window';

    private created() {
        this.currentWindow = remote.getCurrentWindow();
    }

    private minimizeWindow() {
        this.currentWindow.minimize();
    }

    private toggleFullscreen() {
        const isFull = this.currentWindow.isFullScreen();
        if (!isFull) {
            this.toggleIcon = 'mdi-dock-window';
        } else {
            this.toggleIcon = 'mdi-checkbox-blank-outline';
        }
        this.currentWindow.setFullScreen(!isFull);
    }

    private closeWindow() {
        this.currentWindow.close();
    }

}
</script>

<style lang="scss" scoped>
    #draggableRegion {
        -webkit-app-region: drag;
    }

    button:hover {
        background-color: #333;
    }

    #windowControls {
        -webkit-app-region: no-drag;
    }
</style>
