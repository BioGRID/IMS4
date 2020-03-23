import { OrganismEntry, OrganismHash, API_ORGANISM_FETCH } from '@/models/annotation/Organism';

const moduleAnnotationActions = {
    fetch_organisms: async (context: any) => {
        const data: OrganismEntry[] = await API_ORGANISM_FETCH( );
        if (data !== undefined) {
            const organismHash: OrganismHash = {};
            for (const organism of data) {
                organismHash[Number(organism.id)] = organism;
            }
            context.commit( 'ANNOTATION_UPDATE_ORGANISMS', organismHash );
        } else {
            throw new Error( 'Unable to fetch list of organisms from annotation api' );
        }
    },
};

export default moduleAnnotationActions;
