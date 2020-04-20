import { OrganismEntry, OrganismHash, API_ORGANISM_FETCH } from '@/models/annotation/Organism';
import { OntologyHash, OntologyRecord, API_ONTOLOGY_GETALL } from '@/models/annotation/Ontology';

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
    fetch_ontologies: (context: any, payload: any) => {
        return API_ONTOLOGY_GETALL( (data: OntologyRecord[]) => {
            const ontologyHash: OntologyHash = {};
            for (const ontologyRecord of data) {
                ontologyHash[Number(ontologyRecord.ontology_id)] = ontologyRecord;
            }
            context.commit( 'ANNOTATION_UPDATE_ONTOLOGIES', ontologyHash );
        });
    },
};

export default moduleAnnotationActions;
