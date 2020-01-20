const moduleCurationMutations = {
    CURATION_UPDATE_ORGANISMS: (state: any, curationGroups: object) => {
        state.curationGroups = curationGroups;
    },
};

export default moduleCurationMutations;
