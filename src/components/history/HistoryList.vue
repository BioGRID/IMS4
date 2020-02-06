<template>
    <div class='history-list'>
        <v-card 
            tile
            :color="color"
            :dark="dark"
            class='pa-5 p'
        >
            <div class='headline font-weight-bold'> 
                Dataset History ({{ historySize }})
            </div>
            <p class='body-2 mb-2 font-weight-regular'>List of most history entries...</p>
            <v-sheet
                v-for="(history, i) in currentHistory"
                :key="i"
                class='mb-2 pa-2'
                color="grey lighten-4"
                elevation="1"
            >
                <v-chip
                    :color="historyColor( history.method )"
                    label
                    dark
                >
                    <v-avatar left>
                        <v-icon medium>{{ historyIcon(history.method) }}</v-icon>
                    </v-avatar>
                    
                    <span class='font-weight-bold'>{{ history.method }}</span>
                </v-chip>
                <v-chip
                    color="grey darken-3"
                    label
                    dark
                    class='ml-1'
                >
                    <span class='font-weight-bold'>{{ userName(history.user_id) }}</span>
                </v-chip>
                <v-chip
                    color="deep-orange darken-1"
                    label
                    dark
                    class='ml-1'
                >
                    <span class='font-weight-bold'>{{ curationGroup(history.curation_group_id) }}</span>
                </v-chip>

                 <span class='pl-2' v-if="showNote">{{ history.comment }};</span> 
                 <span class='caption'>{{ addedDate( history.added_date ) }}</span>
            </v-sheet>
        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { HistoryEntry } from '@/models/curation/History';
import { CurationGroupHash } from '@/models/curation/CurationGroup';
import { DatasetCurationOptionHash } from '@/models/curation/Dataset';

const curation = namespace( 'curation' );
const auth = namespace( 'auth' );

@Component
export default class HistoryList extends Vue {
    @curation.State private currentHistory!: HistoryEntry[];
    @curation.State private curationGroups!: CurationGroupHash;
    @curation.State private datasetCurationOptions!: DatasetCurationOptionHash;
    @auth.State private users!: any;
    @Prop({type: Number, default: 0}) private refID!: number;
    @Prop({type: String, default: ''}) private refType!: string;
    @Prop({type: String, default: ''}) private color!: string;
    @Prop({type: Boolean, default: false }) private dark!: boolean;
    @Prop({type: Boolean, default: false }) private showNote!: boolean;

    get historySize() {
        return this.currentHistory.length;
    }

    private historyColor( method: string ) {
        return this.datasetCurationOptions[method].color;
    }

    private historyIcon( method: string ) {
        return this.datasetCurationOptions[method].icon;
    }

    private userName( userID: number ) {
        return this.users[userID].name;
    }

    private addedDate( addedDate: string ) {
        const historyDate = new Date( addedDate );
        return historyDate.toUTCString();
    }

    private curationGroup( curationGroupID: number ) {
        return this.curationGroups[curationGroupID].name;
    }

}
</script>

<style lang="scss">
.v-card {
    overflow-wrap: normal !important;
}
</style>