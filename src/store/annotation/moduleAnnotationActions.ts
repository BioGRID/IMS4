import { OrganismEntry, OrganismHash, API_ORGANISM_FETCH } from '@/models/annotation/Organism';
import { OntologyHash, OntologyRecord, API_ONTOLOGY_GETALL } from '@/models/annotation/Ontology';

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
    fetch_ontologies: (context: any, payload: any) => {
        return API_ONTOLOGY_GETALL( (data: OntologyRecord[]) => {
            const ontologyHash: OntologyHash = {};
            for (const ontologyRecord of data) {
                ontologyHash[ontologyRecord.name] = ontologyRecord;
            }
            context.commit( 'ANNOTATION_UPDATE_ONTOLOGIES', ontologyHash );
        });
    },
};

export default moduleAnnotationActions;
