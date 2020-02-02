import { CurationGroupEntry, CurationGroupHash, API_CURATION_GROUP_FETCH } from '@/models/curation/CurationGroup';
import bodybuilder from 'bodybuilder';
import { ELASTIC_QUERY } from '@/models/elastic/Query';
import router from '@/router';

const moduleCurationActions = {
    fetch_curation_groups: (context: any) => {
        return API_CURATION_GROUP_FETCH( (data: CurationGroupEntry[]) => {
            const curationGroupHash: CurationGroupHash = {};
            for (const curationGroup of data) {
                curationGroupHash[Number(curationGroup.curation_group_id)] = curationGroup;
            }
            context.commit( 'CURATION_UPDATE_CURATION_GROUPS', curationGroupHash );
        });
    },
    fetch_current_dataset: (context: any, payload: any) => {
        const query = bodybuilder()
            .filter( 'term', 'source_id', payload.sourceID )
            .filter( 'term', 'source_type', payload.sourceType )
            .build();
        ELASTIC_QUERY( query, 'dataset', true, (data: any) => {
            context.commit( 'CURATION_UPDATE_CURRENT_DATASET', {} );
            if (data.hits.total.value === 1) {
                const dataset = data.hits.hits[0]._source;
                context.commit( 'CURATION_UPDATE_CURRENT_DATASET', dataset );
                router.push( '/curation/DatasetView' );
            }
        });
    },
};

export default moduleCurationActions;
