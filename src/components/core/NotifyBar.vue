<template>
    <div id="ace-notifybar">
        <v-snackbar
            :value="notifyBar"
            :bottom="true"
            :color="notifyColor"
            :timeout="notifyTimeout"
        >
            {{ notifyMessage }}
            <v-btn
                dark
                text
                @click="closeNotifyBar"
            >
                Close
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';

const notify = namespace( 'notify' );

@Component
export default class NavBar extends Vue {
    @notify.State private notifyColor!: string;
    @notify.State private notifyBar!: boolean;
    @notify.State private notifyMessage!: string;
    @notify.State private notifyTimeout!: number;

    private closeNotifyBar() {
        this.$store.dispatch( 'notify/hideNotifyBar' );
    }
}
</script>
