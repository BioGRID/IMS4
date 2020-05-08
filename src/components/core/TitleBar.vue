<template>
    <v-system-bar window dark app id="draggableRegion">
        <v-icon color="yellow accent-4" small>mdi-cards-spade</v-icon>
        <span>{{ fullTitle }}</span>
        <v-spacer></v-spacer>
        <div id="windowControls">
            <v-btn class='mr-6 pl-2' small icon @click="minimizeWindow"><v-icon>mdi-minus</v-icon></v-btn>
            <v-btn class='mr-6 pl-2' small icon @click="toggleMaximized">
                <v-icon>
                    {{ toggleIcon }}
                </v-icon>
            </v-btn>
            <v-btn icon class='pl-2' small @click="closeWindow"><v-icon>mdi-close</v-icon></v-btn>
        </div>
    </v-system-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { remote, BrowserWindow } from 'electron';

@Component
export default class TitleBar extends Vue {
    private fullTitle: string = process.env.VUE_APP_SHORT_TITLE || 'BioGRID ACE';
    private currentWindow!: BrowserWindow;
    private toggleIcon: string = '';

    private created() {
        this.currentWindow = remote.getCurrentWindow();
        this.currentWindow.on( 'maximize', this.maximizeWindow );
        this.currentWindow.on( 'unmaximize', this.unmaximizeWindow );
        this.setToggleIcon();
    }

    private beforeDestroy() {
        this.currentWindow.removeListener( 'maximize', this.maximizeWindow );
        this.currentWindow.removeListener( 'unmaximize', this.unmaximizeWindow );
    }

    private minimizeWindow() {
        this.currentWindow.minimize();
    }

    private setToggleIcon() {
        if (this.currentWindow.isMaximized()) {
            this.toggleIcon = 'mdi-dock-window';
        } else {
            this.toggleIcon = 'mdi-checkbox-blank-outline';
        }
    }

    private toggleMaximized() {
        if (this.currentWindow.isMaximized()) {
            this.currentWindow.unmaximize();
        } else {
            this.currentWindow.maximize();
        }
    }

    private unmaximizeWindow() {
        this.toggleIcon = 'mdi-checkbox-blank-outline';
    }

    private maximizeWindow() {
        this.toggleIcon = 'mdi-dock-window';
    }

    private closeWindow() {
        this.currentWindow.close();
    }

}
</script>

<style lang="scss" scoped>
    #draggableRegion {
        -webkit-app-region: drag;
        -webkit-user-select: none;
    }

    button:hover {
        background-color: #333;
    }

    #windowControls {
        -webkit-app-region: no-drag;
    }
</style>
