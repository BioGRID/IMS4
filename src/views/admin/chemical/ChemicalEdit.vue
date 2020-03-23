<template>
    <div id="chemical-edit">
        <v-container fluid class='pt-0'>
            <v-btn 
                class='float-right mt-4'
                small
                color='primary'
                to='/admin/chemical/chemicalmanager'
                dark
            >< Back</v-btn>
            <h1>Chemical Edit <v-icon color="cyan darken-3" large class="">mdi-account-group</v-icon></h1>
            <div class="subtitle-1">Use the following form to modify an existing chemical. Fill in the fields, and click the 'Update Chemical' button.</div>
            <v-card
                class="mt-2 pa-0"
            >

                <v-card-text>
                    <v-sheet
                        color="blue-grey darken-3" 
                        class="pa-3"
                    >
                        <v-form>
                            <v-row>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-text-field 
                                        label="Chemical Name"
                                        :error-messages="chemicalNameErrors"
                                        dark
                                        required
                                        dense
                                        v-model.trim="chemicalName"
                                        @input="$v.chemicalName.$touch()"
                                        @blur="$v.chemicalName.$touch()"
                                    />
                                </v-col>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-text-field
                                        label="Chemical Type" 
                                        :error-messages="chemicalTypeErrors"
                                        dark
                                        required
                                        dense
                                        v-model.trim="chemicalType"
                                        @input="$v.chemicalType.$touch()"
                                        @blur="$v.chemicalType.$touch()"
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-text-field 
                                        label="Chemical Source"
                                        :error-messages="chemicalSourceErrors"
                                        dark
                                        required
                                        dense
                                        v-model.trim="chemicalSource"
                                        @input="$v.chemicalSource.$touch()"
                                        @blur="$v.chemicalSource.$touch()"
                                    />
                                </v-col>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-text-field
                                        label="Chemical Source ID" 
                                        :error-messages="chemicalSourceIDErrors"
                                        dark
                                        required
                                        dense
                                        v-model.trim="chemicalSourceID"
                                        @input="$v.chemicalSourceID.$touch()"
                                        @blur="$v.chemicalSourceID.$touch()"
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" xl="12" lg="12" md="21" sm="12" xs="12">
                                    <v-textarea 
                                        label="Chemical Description" 
                                        :error-messages="chemicalDescriptionErrors"
                                        dark
                                        required
                                        dense
                                        v-model.trim="chemicalDescription"
                                        @input="$v.chemicalDescription.$touch()"
                                        @blur="$v.chemicalDescription.$touch()"
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" xl="12" lg="12" md="21" sm="12" xs="12">
                                    <v-textarea 
                                        label="Chemical Smile" 
                                        dark
                                        dense
                                        v-model.trim="chemicalSmile"
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-text-field 
                                        label="Molecular Formula"
                                        dark
                                        dense
                                        v-model.trim="chemicalFormula"
                                    />
                                </v-col>
                                <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
                                    <v-text-field
                                        label="Molecular Weight" 
                                        dark
                                        dense
                                        v-model.trim="chemicalMolecularWeight"
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" xl="12" lg="12" md="21" sm="12" xs="12">
                                    <v-text-field 
                                        label="InChiKey" 
                                        dark
                                        dense
                                        v-model.trim="chemicalInChiKey"
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" xl="12" lg="12" md="21" sm="12" xs="12">
                                    <v-textarea 
                                        label="InChi" 
                                        dark
                                        dense
                                        v-model.trim="chemicalInChi"
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" xl="12" lg="12" md="21" sm="12" xs="12">
                                    <ExpandableInputPanel
                                        panelDataTableTitle="Chemical Synonyms"
                                        panelLabel="Synonyms"
                                        panelDesc="Update/Add chemical synonyms"
                                        :fieldsToRemoveEntry="this.fieldsToRemoveSynonymEntry"
                                        :panelEntryTableHeaders="this.synonymTableHeaders"
                                        :panelDisplayRows="this.displaySynonmRows"
                                        @updateEntries="updateChemicalSynonyms"
                                    >
                                    </ExpandableInputPanel>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" xl="12" lg="12" md="21" sm="12" xs="12">
                                    <ExpandableInputPanel
                                        panelDataTableTitle="Chemical External Database References"
                                        panelLabel="External Database References"
                                        panelDesc="Update/Add chemical external database references"
                                        :fieldsToRemoveEntry="this.fieldsToRemoveDBxrefsEntry"
                                        :panelEntryTableHeaders="this.dBxrefsTableHeaders"
                                        :panelDisplayRows="this.chemicalDBxrefs"  
                                        @updateEntries="updateChemicalDBxrefs"
                                    ></ExpandableInputPanel>
                                </v-col>
                            </v-row>
                            <v-btn 
                                @click="submitChemical"
                                size="x-large"
                                color="success"
                                dark
                                :disabled="isInvalid"
                            >Update Chemical</v-btn>
                        </v-form>
                    </v-sheet>
                </v-card-text>
            </v-card>

        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { required } from 'vuelidate/lib/validators';
import { printableAsciiOnly } from '@/utils/Validators';
import { generateValidationError } from '@/utils/ValidationErrors';
import { API_CHEMICAL_FETCH, ChemicalSynonymMap } from '@/models/annotation/Chemical';
import ExpandableInputPanel from '@/components/forms/ExpandableInputPanel.vue';

const auth = namespace( 'auth' );

@Component({
    components: {
        ExpandableInputPanel,
    },
})
export default class ChemicalEdit extends Vue {
    private chemicalID: number = 0;
    private chemicalName: string = '';
    private chemicalType: string = '';
    private chemicalSource: string = '';
    private chemicalSourceID: string = '';
    private chemicalDescription: string = '';
    private chemicalSynonyms: string[] = [];
    private chemicalFormula: string = '';
    private chemicalMolecularWeight: string = '';
    private chemicalSmile: string = '';
    private chemicalInChi: string = '';
    private chemicalInChiKey: string = '';
    private fieldsToRemoveSynonymEntry: string[] = [];
    private chemicalDBxrefs: string[] = [];
    private synonymTableHeaders: any[] = [
        {
            title: 'Synonm Name',
            field: 'name',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Name',
            sortDirection: 'asc',
            sortOrder: 1,
            className: 'text-left',
        },
        {
            title: 'Tools',
            field: 'tools',
            sortable: false,
            searchable: false,
            searchType: '',
            searchName: 'Tools',
            sortDirection: '',
            sortOrder: 0,
            className: 'nowrap text-center',
        },
    ];
    private displaySynonmRows: any[] = [];
    private fieldsToRemoveDBxrefsEntry: string[] = [];
    private dBxrefsTableHeaders: any[] = [
        {
            title: 'Source',
            field: 'source',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Name',
            sortDirection: 'asc',
            sortOrder: 1,
            className: 'text-left',
        },
        {
            title: 'Source ID',
            field: 'source_id',
            sortable: true,
            searchable: true,
            searchType: 'Text',
            searchName: 'Name',
            sortDirection: 'asc',
            sortOrder: 0,
            className: 'text-left',
        },
        {
            title: 'Tools',
            field: 'tools',
            sortable: false,
            searchable: false,
            searchType: '',
            searchName: 'Tools',
            sortDirection: '',
            sortOrder: 0,
            className: 'nowrap text-center',
        },
    ];

    public created() {
        this.initializeFieldValues();
    }

    private async initializeFieldValues() {
        const data = await API_CHEMICAL_FETCH( this.$route.params.id );
        if (data !== undefined) {
            this.chemicalName = data.name;
            this.chemicalID = data.chemical_id;
            this.chemicalType = data.chemical_type;
            this.chemicalSource = data.source;
            this.chemicalSourceID = data.source_id;
            this.chemicalFormula = data.formula;
            this.chemicalMolecularWeight = data.molecular_weight;
            this.chemicalSmile = data.smile;
            this.chemicalInChi = data.inchi;
            this.chemicalInChiKey = data.inchikey;
            this.chemicalDescription = data.description;
            this.chemicalSynonyms = data.synonyms.split('|');
            let hit: any;
            for (hit of this.chemicalSynonyms) {
                this.displaySynonmRows.push( {['name']: hit} );
            }
            this.chemicalDBxrefs = data.dbxrefs;
            this.fieldsToRemoveSynonymEntry = ['name'];
            this.fieldsToRemoveDBxrefsEntry = ['source', 'source_id'];
        }
    }

    private updateChemicalSynonyms( synonyms: string[] ) {
        this.chemicalSynonyms = synonyms;
    }

    private updateChemicalDBxrefs( DBxrefs: string[] ) {
        this.chemicalDBxrefs = DBxrefs;
    }


    get chemicalSourceErrors() {
        const errors = [];
        if (this.$v.chemicalSource.$dirty) {
            if (!this.$v.chemicalSource.required) {
                errors.push( generateValidationError( 'required', 'Chemical Source', null ));
            } else if (!this.$v.chemicalSource.printableAsciiOnly) {
                errors.push( generateValidationError( 'printableAsciiOnly', 'Chemical Source', null ));
            }
        }
        return errors;
    }

    get chemicalSourceIDErrors() {
        const errors = [];
        if (this.$v.chemicalSourceID.$dirty) {
            if (!this.$v.chemicalSourceID.required) {
                errors.push( generateValidationError( 'required', 'Chemical Source ID', null ));
            } else if (!this.$v.chemicalSourceID.printableAsciiOnly) {
                errors.push( generateValidationError( 'printableAsciiOnly', 'Chemical Source ID', null ));
            }
        }
        return errors;
    }

    get chemicalTypeErrors() {
        const errors = [];
        if (this.$v.chemicalType.$dirty) {
            if (!this.$v.chemicalType.required) {
                errors.push( generateValidationError( 'required', 'Chemical Type', null ));
            } else if (!this.$v.chemicalType.printableAsciiOnly) {
                errors.push( generateValidationError( 'printableAsciiOnly', 'Chemical Type', null ));
            }
        }
        return errors;
    }

    get chemicalNameErrors() {
        const errors = [];
        if (this.$v.chemicalName.$dirty) {
            if (!this.$v.chemicalName.required) {
                errors.push( generateValidationError( 'required', 'Chemical Name', null ));
            } else if (!this.$v.chemicalName.printableAsciiOnly) {
                errors.push( generateValidationError( 'printableAsciiOnly', 'Chemical Name', null ));
            }
        }
        return errors;
    }

    get chemicalDescriptionErrors() {
        const errors = [];
        if (this.$v.chemicalDescription.$dirty) {
            if (!this.$v.chemicalDescription.required) {
                errors.push( generateValidationError( 'required', 'Chemical Description', null ));
            } else if (!this.$v.chemicalDescription.printableAsciiOnly) {
                errors.push( generateValidationError( 'printableAsciiOnly', 'Chemical Description', null ));
            }
        }
        return errors;
    }

    get isInvalid() {
        return this.$v.$invalid;
    }

    private submitChemical( ) {
        this.$v.$touch();
        console.log(this.chemicalSynonyms);
        if (!this.$v.$invalid) {
            // need to write this
        }
    }

    private validations() {
        return {
            chemicalName: { required, printableAsciiOnly },
            chemicalType: { required, printableAsciiOnly },
            chemicalSource: { required, printableAsciiOnly },
            chemicalSourceID: { required, printableAsciiOnly },
            chemicalDescription: { required, printableAsciiOnly },
        };
    }
}

</script>
