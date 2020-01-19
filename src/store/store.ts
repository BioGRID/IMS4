import Vue from 'vue';
import Vuex from 'vuex';

import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex);

import moduleAuth from './auth/moduleAuth';
import moduleNotify from './notify/moduleNotify';
import moduleAnnotation from './annotation/moduleAnnotation';
import moduleAce from './ace/moduleAce';

export default new Vuex.Store({
    getters,
    mutations,
    state,
    actions,
    modules: {
        auth: moduleAuth,
        notify: moduleNotify,
        annotation: moduleAnnotation,
        ace: moduleAce,
    },
    strict: true,
});
