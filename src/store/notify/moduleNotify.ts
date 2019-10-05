/**
 * Copyright 2019 BioGRID Project. All rights reserved.
 * Use of this source code is governed by the MIT License
 * license that can be found in the LICENSE file.
 */

import state from './moduleNotifyState';
import mutations from './moduleNotifyMutations';
import actions from './moduleNotifyActions';
import getters from './moduleNotifyGetters';

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
