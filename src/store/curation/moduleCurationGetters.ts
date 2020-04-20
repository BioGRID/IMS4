const moduleCurationGetters = {
    getCurationGroup: (state: any) => (curationGroupID: number) => {
        return state.curationGroups[curationGroupID];
    },
    getDatasetCurationOption: (state: any) => (optionValue: string) => {
        return state.getDatasetCurationOptions[optionValue];
    },
    getOpenDataset: (state: any) => (datasetID: number) => {
        return state.openDatasets.get(datasetID);
    },
    getOpenHistory: (state: any) => (datasetID: number) => {
        return state.openHistory.get(datasetID);
    },
};

export default moduleCurationGetters;
