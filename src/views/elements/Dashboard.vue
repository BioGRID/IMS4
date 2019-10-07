<template>
    <div id="dashboard">
        <v-container fluid class='pt-0'>
            <h2>Welcome <span class="red--text">{{ fullName }}</span> to the {{ fullTitle }}</h2>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea atque reiciendis repudiandae facere autem nisi quaerat vel nobis labore minima veniam odio eaque earum expedita molestiae vitae dolores, magnam doloremque. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum quas voluptatem, numquam ullam quos laborum voluptas dolorem dolore sapiente aliquid officiis error quam voluptatibus optio illum perferendis. Repudiandae, repellat nemo.</p>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';

const auth = namespace( 'auth' );

@Component
export default class Dashboard extends Vue {
    private fullTitle: string = process.env.VUE_APP_FULL_TITLE || 'BioGRID ACE';
    @auth.State private user!: any;

    get fullName() {
        return this.user.first_name + " " + this.user.last_name;
    }

}

</script>
