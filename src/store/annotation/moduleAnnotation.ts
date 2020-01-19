/**
 * Copyright 2019 BioGRID Project. All rights reserved.
 * Use of this source code is governed by the MIT License
 * license that can be found in the LICENSE file.
 */

import state from './moduleAnnotationState';
import mutations from './moduleAnnotationMutations';
import actions from './moduleAnnotationActions';
import getters from './moduleAnnotationGetters';

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
