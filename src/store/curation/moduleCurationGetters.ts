const moduleCurationGetters = {
    getCurationGroup: (state: any) => (curationGroupID: number) => {
        return state.curationGroups[curationGroupID];
    },
    getDatasetCurationOption: (state: any) => (optionValue: string) => {
        return state.getDatasetCurationOptions[optionValue];
    },
};

export default moduleCurationGetters;
