<template>
    <div class='add-chemical-name-form'>
       
            <v-text-field
                label="Add New Entry"  
                :hint="showHint === true ? newHint : ''" 
                ref="addPanelField" 
                dense
                prepend-icon=mdi-plus
                @click:prepend="addEntry"
                v-model.trim="newEntry"
            >
            </v-text-field>
   
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';

@Component
export default class AddChemicalNameForm extends Vue {
    @Prop(Array) private panelDisplayRows!: any[];
    private showHint: boolean = false;
    private newHint: string = '';
    private newEntry: string = '';

    private addEntry() {

        const addPanelField = this.$refs.addPanelField as HTMLElement;

        if ( !this.newEntry ) {
            this.newHint = 'Please add a new entry';
            this.showHint = true;
            addPanelField.focus();
        } else {
            if (this.panelDisplayRows.findIndex( ({ name }) => name === this.newEntry ) > -1) {
                this.newHint = 'Entry already exists';
                this.showHint = true;
                addPanelField.focus();
            } else {
                this.panelDisplayRows.push( {['name']: this.newEntry} );
                this.newEntry = '';
                this.showHint = false;
                this.newEntry = '';
            }
        }
    }

}
</script>

<style lang="scss">
.add-chemical-name-form {
    padding-top: 25px;
}
</style>