const moduleCurationMutations = {
    CURATION_UPDATE_CURATION_GROUPS: (state: any, curationGroups: object) => {
        state.curationGroups = curationGroups;
    },
    CURATION_UPDATE_CURRENT_DATASET: (state: any, dataset: object) => {
        state.currentDataset = dataset;
    },
};

export default moduleCurationMutations;
