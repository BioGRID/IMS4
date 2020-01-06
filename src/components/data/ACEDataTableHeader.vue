<template>
    <th>
        {{ title }}
        <template v-if="sortable">
            <v-icon v-if="sortDirection === 'asc'"
                dark
                small
            >
                mdi-arrow-up
            </v-icon>
        </template>
    </th>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class ACEDataTableHeader extends Vue {
    @Prop(String) private title!: string;
    @Prop(Boolean) private sortable!: boolean;
    @Prop(String) private sortDirection!: string;
}

</script>

<style lang="scss" scoped>
</style>