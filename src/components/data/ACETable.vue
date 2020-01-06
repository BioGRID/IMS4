<template>
    <div class="ace-table">
        <v-card>
            <v-card-title>
                {{ title }}
                <v-spacer v-if="showSearch"></v-spacer>
                <v-text-field
                    v-if="showSearch"
                    v-model="searchText"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-data-table
                :headers="headers"
                :items="items"
                :items-per-page="itemsPerPage"
                :footer-props="permissionTableFooterProps"
                class="elevation-1 smallFont" 
                :search="searchText"
                :sort-by="sortBy"
                :sort-desc="sortDesc"
                :multi-sort="true"
                dense
                :loading="loading"
            >
                <template v-slot:item.level="{ item }">
                    <v-select 
                        label="Permission Level" 
                        :items="permLevels"
                        light
                        required
                        dense
                        :hide-details="true"
                        solo
                        :value="item.level"
                        @change="updatePermission( item.id, $event )"
                        class="pa-0 ma-0 pt-2 pb-2"
                    />
                    
                    <!--<v-chip :color="getColor(item.level)" dark>{{ item.level }}</v-chip>-->
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class ACETable extends Vue {
    @Prop(String) private title!: string;
    @Prop(Boolean) private showSearch!: boolean;
    @Prop(Array) private sortBy!: string[];
    @Prop(Array) private sortDesc!: boolean[];
    @Prop(Array) private headers!: object[];
    @Prop(Array) private items!: object[];
    @Prop(Number) private itemsPerPage!: number;
    @Prop(Boolean) private loading!: boolean;
    private permLevels: object[] = [
        { text: 'Observer', value: 'observer' },
        { text: 'Standard', value: 'standard' },
        { text: 'Manager', value: 'manager' },
        { text: 'Power User', value: 'poweruser' },
        { text: 'Admin', value: 'admin' },
    ];
    private searchText: string = '';
    private permissionTableFooterProps: object = {
        itemsPerPageOptions: [25, 50, 75, 100, 250, 500],
    };

    private getColor(level: string) {
        if (level === 'admin') {
            return 'red';
        } else if (level === 'poweruser') {
            return 'blue';
        } else if (level === 'observer') {
            return 'green';
        } else if (level === 'standard') {
            return 'orange';
        } else if (level === 'manager') {
            return 'purple';
        }

        return 'pink';
    }

    private updatePermission(permID: number, event: any) {
        
    }

}

</script>