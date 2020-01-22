const moduleCurationMutations = {
    CURATION_UPDATE_CURATION_GROUPS: (state: any, curationGroups: object) => {
        state.curationGroups = curationGroups;
    },
};

export default moduleCurationMutations;
