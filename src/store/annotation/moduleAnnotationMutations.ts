const moduleAnnotationMutations = {
    ANNOTATION_UPDATE_ORGANISMS: (state: any, organisms: object) => {
        state.organisms = organisms;
    },
    ANNOTATION_UPDATE_ONTOLOGIES: (state: any, ontologies: object) => {
        state.ontologies = ontologies;
    },
};

export default moduleAnnotationMutations;
