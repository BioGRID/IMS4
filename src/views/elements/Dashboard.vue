<template>
    <div id="dashboard">
        <v-container fluid class='pt-0'>
            <v-alert 
                type="error" 
                dense
                v-if="this.user.password_reset === 1"
            >
                You must change your password. <v-btn small color='primary' dark to='/admin/user/changemypassword'>Change Password</v-btn>
            </v-alert>
            <v-btn class='float-right mt-2' small color='primary' dark to='/pages/login'>Logout <v-icon small>mdi-logout</v-icon></v-btn>
            <h1>Welcome Back <span class="highlight--text">{{ firstName }}</span>!</h1>
            <v-divider class='mb-3' />
            <v-row no-gutters>
                <v-col cols="12" xl="9" lg="8" md="6" sm="6" xs="12">
                    <p>You are now using version <strong><span class="highlight--text">{{ appVersion }}</span></strong> of the <strong>{{ fullTitle }}</strong>. This is a private system used in curation and maintainance of the entire suite of <a class='plainLink' href='https://thebiogrid.org' target='_BLANK'>BioGRID</a> Projects and Applications. If you are logged-in accidentally, please immediately <a class='plainLink' href='/pages/login'>logout</a>.</p>
                    
                    <v-row no-gutters class='mb-3'>
                        <v-col cols="12" xl="4" lg="4" md="6" sm="12" xs="12">
                            <h4 class='mb-2 '>BioGRID Linkouts</h4>
                            <ul>
                                <li 
                                    v-for="(linkout, i) in biogridLinkouts"
                                    :key="i"
                                >
                                    <a class='plainLink' :href="linkout.to" target='_BLANK' :title="linkout.name">{{ linkout.name }}</a>
                                </li>
                            </ul>
                        </v-col>
                        <v-col cols="12" xl="4" lg="4" md="6" sm="12" xs="12">
                            <h4 class='mb-2 '>Model Organism Linkouts</h4>
                            <ul>
                                <li 
                                    v-for="(linkout, i) in modLinkouts"
                                    :key="i"
                                >
                                    <a class='plainLink' :href="linkout.to" target='_BLANK' :title="linkout.name">{{ linkout.name }}</a>
                                </li>
                            </ul>
                        </v-col>
                        <v-col cols="12" xl="4" lg="4" md="6" sm="12" xs="12">
                            <h4 class='mb-2 '>Resource Linkouts</h4>
                            <ul>
                                <li 
                                    v-for="(linkout, i) in resourceLinkouts"
                                    :key="i"
                                >
                                    <a class='plainLink' :href="linkout.to" target='_BLANK' :title="linkout.name">{{ linkout.name }}</a>
                                </li>
                            </ul>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col  cols="12" xl="3" lg="4" md="6" sm="6" xs="12">
                    <PublicationSearch />
                </v-col>
            </v-row>
            <v-divider class='pt-0 mb-0' />
            <v-row>
                <v-col cols="12" xl="3" lg="3" md="6" sm="12" xs="12" class="text-center">
                    <StatsCard 
                        icon='mdi-timer-sand' 
                        title='In Progress'
                        value='12'
                        dark
                        color='green darken-2'
                        iconColor="green lighten-4"
                        smallValue='Publications'
                    />
                </v-col>
                <v-col cols="12" xl="3" lg="3" md="6" sm="12" xs="12" class="text-center">
                    <StatsCard 
                        icon='mdi-timer' 
                        title='On Hold'
                        value='18'
                        dark
                        color='light-blue darken-3'
                        iconColor="light-blue lighten-4"
                        smallValue='Publications'
                    />
                </v-col>
                <v-col cols="12" xl="3" lg="3" md="6" sm="12" xs="12" class="text-center">
                    <StatsCard 
                        icon='mdi-run-fast' 
                        title='Scheduled to Run'
                        value='9'
                        dark
                        color='deep-purple darken-3'
                        iconColor="deep-purple lighten-4"
                        smallValue='Tasks'
                    />
                </v-col>
                <v-col cols="12" xl="3" lg="3" md="6" sm="12" xs="12" class="text-center">
                    <StatsCard 
                        icon='mdi-checkbox-marked-circle-outline' 
                        title='Recently Completed'
                        value='27'
                        dark
                        color='yellow darken-4'
                        iconColor="yellow lighten-4"
                        smallValue='Tasks'
                    />
                </v-col>
            </v-row>
            <v-divider class='pt-0 mt-1 mb-3' />
            <h2>Curation Queue</h2>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import PublicationSearch from '@/components/operations/PublicationSearch.vue';
import StatsCard from '@/components/cards/StatsCard.vue';

const auth = namespace( 'auth' );

@Component({
    components: {
        PublicationSearch,
        StatsCard,
    },
})
export default class Dashboard extends Vue {
    @auth.State private user!: any;
    private fullTitle: string = process.env.VUE_APP_FULL_TITLE || 'BioGRID ACE';
    private appVersion: string = process.env.VUE_APP_VERSION || '0.0.1';
    private biogridLinkouts: object[] = [{
        to: 'https://thebiogrid.org',
        name: 'The BioGRID',
    }, {
        to: 'https://orcs.thebiogrid.org',
        name: 'BioGRID ORCS',
    }, {
        to: 'https://cup.tyerslab.com',
        name: 'BioGRID C-UP',
    }, {
        to: 'http://ims.tyerslab.com',
        name: 'Legacy IMS',
    }];
    private modLinkouts: object[] = [{
        to: 'https://www.yeastgenome.org/',
        name: 'SGD',
    }, {
        to: 'https://www.genenames.org/',
        name: 'HGNC',
    }, {
        to: 'http://flybase.org/',
        name: 'FlyBase',
    }, {
        to: 'https://wormbase.org',
        name: 'Wormbase',
    }];
    private resourceLinkouts: object[] = [{
        to: 'https://www.ncbi.nlm.nih.gov/pubmed',
        name: 'Pubmed',
    }, {
        to: 'https://www.ncbi.nlm.nih.gov/gene',
        name: 'Entrez Gene',
    }, {
        to: 'https://www.uniprot.org/',
        name: 'Uniprot',
    }, {
        to: 'https://www.chemspider.com/',
        name: 'ChemSpider',
    }];

    get firstName() {
        return this.user.first_name;
    }

}

</script>
