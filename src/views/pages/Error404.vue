<template>
    <v-container fill-height>
        <v-layout row wrap align-center>
            <v-flex class="text-center">
                <v-card outlined width="800" height="320" class="mx-auto" raised>
                    <v-row>
                        <v-col sm="6" class="pr-0 pt-0 pb-0">
                            <v-card flat class="mx-auto ml-0">
                                <v-img
                                    height="319px"
                                    src="@/assets/angry_rufus.jpg"
                                />
                            </v-card>
                        </v-col>
                        <v-col sm="6">
                            <v-card flat class="text-left mr-3" style="height: 295px">
                                <v-row>
                                    <v-col sm="12">
                                        <h1 class='display-1 font-weight-condensed'>Not Found (404)</h1>
                                        <p class='mt-3'>This location you attempted to access could not be found. This could be our fault (bad link/redirect/removed tool) or it could be yours (incorrectly entered location). Either way, it sucks to end up here and we apologize. Please try again and contact the administrator if you believe you should not be seeing this page.</p>
                                        <v-btn 
                                                size="x-large"
                                                color="primary"
                                                to="/"
                                            >
                                                Return to Dashboard
                                            </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Error404 extends Vue {}

</script>

<style lang="scss" scoped>
</style>