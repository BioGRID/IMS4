<template>
    <div id="permission-manager">
        <v-container fluid class='pt-0'>
            <v-btn 
                class='float-right mt-4'
                small
                color='primary'
                to='/elements/admin'
                dark
            >< Back</v-btn>
            <h1>Socket Status</h1>
            <div class="subtitle-1">This view shows the current status of the websocket associated with this instance of the application.</div>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { required } from 'vuelidate/lib/validators';
import { State, namespace } from 'vuex-class';
import { printableAsciiOnly, lettersAndSpacesOnly } from '@/utils/Validators';
import ACETable from '@/components/data/ACETable.vue';
import axios from 'axios';

const auth = namespace( 'auth' );

@Component({
    components: {
        ACETable,
    },
})
export default class SocketStatus extends Vue {
}

</script>