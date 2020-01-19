import { OrganismEntry, OrganismHash, API_ORGANISM_FETCH } from '@/apis/annotation/Organism';

const moduleAnnotationActions = {
    fetch_organisms: (context: any) => {
        return API_ORGANISM_FETCH( (data: OrganismEntry[]) => {
            const organismHash: OrganismHash = {};
            for (const organism of data) {
                organismHash[Number(organism.id)] = organism;
            }
            context.commit( 'ANNOTATION_UPDATE_ORGANISMS', organismHash );
        });
    },
};

export default moduleAnnotationActions;
