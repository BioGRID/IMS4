const moduleAnnotationGetters = {
    getOrganism: (state: any) => (organismID: number) => {
        return state.organisms[organismID];
    },
};

export default moduleAnnotationGetters;
