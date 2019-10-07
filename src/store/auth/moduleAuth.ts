/**
 * Copyright 2019 BioGRID Project. All rights reserved.
 * Use of this source code is governed by the MIT License
 * license that can be found in the LICENSE file.
 */

import state from './moduleAuthState';
import mutations from './moduleAuthMutations';
import actions from './moduleAuthActions';
import getters from './moduleAuthGetters';

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
