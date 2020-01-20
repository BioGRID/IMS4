/**
 * Copyright 2019 BioGRID Project. All rights reserved.
 * Use of this source code is governed by the MIT License
 * license that can be found in the LICENSE file.
 */

import state from './moduleCurationState';
import mutations from './moduleCurationMutations';
import actions from './moduleCurationActions';
import getters from './moduleCurationGetters';

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
