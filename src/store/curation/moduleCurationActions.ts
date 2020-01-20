import { CurationGroupEntry, CurationGroupHash, API_CURATION_GROUP_FETCH } from '@/apis/curation/CurationGroup';

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
};

export default moduleCurationActions;
