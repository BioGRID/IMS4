<template>
    <v-navigation-drawer 
        id="ace-sidebar"
        width="200" 
        dark
        app 
        floating
        color="primary"
        class="mt-6"
        permanent
        :mini-variant="navDrawerMinimized"
    >

        <v-list-item class='mt-1'>
            <v-list-item-action>
                <img
                    src='@/assets/logo_small_gold.png' 
                    height='22'
                    contain
                />
            </v-list-item-action>
            <v-list-item-title class="title ml-n5">
                <span class="font-weight-thin">{{ firstTitle }}</span><span class="font-weight-bold font-italic yellow--text text--accent-4">{{ secondTitle }}</span>
            </v-list-item-title>
        </v-list-item>

        <v-divider />
        
        <v-list dense :disabled="loadingOverlayVisible">
            <v-list-item
                v-for="(link, i) in primaryLinks"
                :key="i"
                :to="link.to"
                active-class="secondary black--text"
            >
                <v-list-item-action>
                    <v-icon>{{ link.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content class="ml-n5">
                    <v-list-item-title v-text="link.text" /> 
                    <v-list-item-subtitle class='' v-text="link.subtitle" />
                </v-list-item-content>
            </v-list-item>
        </v-list>

        <v-divider />

        <v-list dense v-if="!navDrawerMinimized">
            <v-list-item
                class='ml-n2 mr-n2'
                active-class="secondary black--text"
            >
                <v-list-item-content>
                    <v-text-field 
                        label="Dataset Search"
                        :error-messages="publicationIDErrors"
                        light
                        required
                        :disabled="loadingOverlayVisible"
                        dense
                        solo
                        :hide-details="true"
                        append-icon="mdi-magnify"
                        v-model.trim="publicationID"
                        title="Search for Datasets by Numeric Publication ID (example: pubmed)"
                        @click:append="submitPublicationSearch"
                        @input="$v.publicationID.$touch()"
                        @blur="$v.publicationID.$touch()"
                    />
                </v-list-item-content>
            </v-list-item>
        </v-list>

        <v-divider />

        <v-list :dark="true" dense v-if="currentCurationDrawerLinks.length > 0" :disabled="loadingOverlayVisible">
            <v-subheader v-if="!navDrawerMinimized">Open Datasets</v-subheader>
            <v-list-item
                v-for="(link, i) in currentCurationDrawerLinks"
                :key="i"
                :to="link.to"
                active-class="secondary black--text"
            >
                <v-list-item-action>
                    <v-icon>{{ link.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content class="ml-n5">
                    <v-list-item-title v-text="link.text" /> 
                    <v-list-item-subtitle class='' v-text="link.subtitle" />
                </v-list-item-content>
            </v-list-item>
        </v-list>

    </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { required, numeric, maxLength } from 'vuelidate/lib/validators';
import { printableAsciiOnly, lettersAndSpacesOnly } from '@/utils/Validators';
import { generateValidationError } from '@/utils/ValidationErrors';
import { CurationDrawerLink } from '@/models/curation/CurationDrawerLink';
import Vuelidate from 'vuelidate';

const curation = namespace( 'curation' );

@Component
export default class NavDrawer extends Vue {
    @State private navDrawerMinimized!: boolean;
    @State private loadingOverlayVisible!: boolean;
    @curation.State private currentCurationDrawerLinks!: object[];
    private firstTitle: string = process.env.VUE_APP_FIRST_TITLE || 'BioGRID';
    private secondTitle: string = process.env.VUE_APP_SECOND_TITLE || 'ACE';
    private publicationID: string = '20489023';
    private publicationType: string = 'pubmed';
    private maxPublicationIDLength: number = 8;
    private currentDrawerLinks: CurationDrawerLink[] = [];
    private publicationTypes = [
        { text: 'Pubmed', value: 'pubmed' },
        { text: 'Pre-Publication', value: 'prepub' },
    ];
    private primaryLinks: object[] = [
        {
            to: '/',
            icon: 'mdi-view-dashboard',
            text: 'Dashboard',
            subtitle: 'Get Started Here',
        },
    ];

    get publicationIDErrors() {
        const errors = [];
        if (this.$v.publicationID.$dirty) {
            if (!this.$v.publicationID.required) {
                errors.push( generateValidationError( 'required', 'Publication ID', null ));
            } else if (!this.$v.publicationID.numeric) {
                errors.push( generateValidationError( 'numeric', 'Publication ID', null ));
            } else if (!this.$v.publicationID.maxLength) {
                errors.push( generateValidationError( 'maxLength', 'Publication ID', String(this.maxPublicationIDLength) ));
            }
        }
        return errors;
    }

    get isInvalid() {
        return this.$v.$invalid;
    }

    private submitPublicationSearch() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            this.$router.push({ path: '/curation/DatasetLoad/' + this.publicationType + '/' + this.publicationID });
        }
    }

    private validations() {
        return {
            publicationID: { required, numeric, maxLength: maxLength(this.maxPublicationIDLength) },
        };
    }

}
</script>