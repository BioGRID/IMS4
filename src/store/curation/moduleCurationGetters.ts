const moduleCurationGetters = {
    getCurationGroup: (state: any) => (curationGroupID: number) => {
        return state.curationGroups[curationGroupID];
    },
};

export default moduleCurationGetters;
