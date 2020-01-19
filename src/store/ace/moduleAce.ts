/**
 * Copyright 2019 BioGRID Project. All rights reserved.
 * Use of this source code is governed by the MIT License
 * license that can be found in the LICENSE file.
 */

import state from './moduleAceState';
import mutations from './moduleAceMutations';
import actions from './moduleAceActions';
import getters from './moduleAceGetters';

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
