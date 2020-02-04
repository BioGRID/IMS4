const moduleCurationMutations = {
    CURATION_UPDATE_CURATION_GROUPS: (state: any, curationGroups: object) => {
        state.curationGroups = curationGroups;
    },
    CURATION_UPDATE_CURRENT_DATASET: (state: any, dataset: object) => {
        state.currentDataset = dataset;
    },
    CURATION_UPDATE_DRAWER_LINKS: (state: any, links: object[]) => {
        state.curationDrawerLinks = links;
    },
    TOGGLE_DATASET_COLLAPSED: (state: any) => {
        state.datasetCollapsed = !state.datasetCollapsed;
    },
};

export default moduleCurationMutations;
