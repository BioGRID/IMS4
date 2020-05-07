<template>
    <div class='unknown-block'>
        <v-card color="pink lighten-1" height="200px">
            Unknown Block
        </v-card>
        <v-row>
            <v-col xl="12" lg="12" md="12" sm="12" xs="12">
                <v-btn
                    color="success"
                    :disabled="!isComplete"
                    @click="completeBlock"
                    fab
                    small
                    title="Remove block from curation workflow"
                    class='elevation-2 mr-2' 
                >
                    <v-icon>mdi-check</v-icon>
                </v-btn>
                <v-btn
                    color="error"
                    v-if="!required"
                    @click="removeBlock"
                    fab
                    small
                    title="Finish Block, Mark as Completed"
                    class='elevation-2' 
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';

@Component
export default class UnknownBlock extends Vue {
    @Prop({type: Number, default: 0}) private id!: number;
    @Prop({type: String, default: ''}) private name!: string;
    @Prop({type: String, default: ''}) private title!: string;
    @Prop({type: Boolean, default: false}) private required!: boolean;
    @Prop() private settings!: Record<string, string>;

    get isComplete() {
        return this.validateBlock();
    }

    private validateBlock() {
        return true;
    }

    private completeBlock() {
        if (this.validateBlock()) {
            this.$emit( 'complete', this.id, {} );
        }
    }

    private removeBlock() {
        this.$emit( 'remove', this.id );
    }

}
</script>

<style lang="scss">
</style>