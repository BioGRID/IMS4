import { CurationGroupEntry, CurationGroupHash, API_CURATION_GROUP_FETCH } from '@/models/curation/CurationGroup';
import { AttributeTypeEntry, AttributeTypeHash, API_ATTRIBUTE_TYPE_FETCH } from '@/models/curation/AttributeType';
import { ProcessingTask, ProcessingTaskHash, API_TASK_FETCH } from '@/models/curation/ProcessingTask';
import { API_HISTORY_FETCH, HistoryEntry } from '@/models/curation/History';
import { CurationDrawerLink } from '@/models/curation/CurationDrawerLink';
import bodybuilder from 'bodybuilder';
import { ELASTIC_QUERY } from '@/models/elastic/Query';
import notification from '@/utils/Notifications';

const moduleCurationActions = {
    toggleDatasetCollapsed: (context: any) => {
        context.commit( 'CURATION_TOGGLE_DATASET_COLLAPSED' );
    },
    fetch_curation_groups: async (context: any) => {
        const data: CurationGroupEntry[] = await API_CURATION_GROUP_FETCH( );
        if (data !== undefined) {
            const curationGroupHash: CurationGroupHash = {};
            for (const curationGroup of data) {
                curationGroupHash[Number(curationGroup.curation_group_id)] = curationGroup;
            }
            context.commit( 'CURATION_UPDATE_CURATION_GROUPS', curationGroupHash );
        } else {
            throw new Error( 'Unable to fetch list of curation groups from curation api' );
        }
    },
    fetch_attribute_types: async (context: any) => {
        const data: AttributeTypeEntry[] = await API_ATTRIBUTE_TYPE_FETCH( );
        if (data !== undefined) {
            const attributeTypeHash: AttributeTypeHash = {};
            for (const attributeType of data) {
                attributeTypeHash[attributeType.shortcode] = attributeType;
            }
            context.commit( 'CURATION_UPDATE_ATTRIBUTE_TYPES', attributeTypeHash );
        } else {
            throw new Error( 'Unable to fetch list of attribute types from curation api' );
        }
    },
    fetch_processing_tasks: async (context: any) => {
        const data: ProcessingTask[] = await API_TASK_FETCH( context.state.maxProcessingTasks, false );
        if (data !== undefined) {
            const processingTaskHash: ProcessingTaskHash = {};
            for (const task of data) {
                processingTaskHash[task.processing_id] = task;
            }
            context.commit( 'CURATION_UPDATE_PROCESSING_TASKS', processingTaskHash );
        } else {
            throw new Error( 'Unable to fetch recent processing tasks from curation api' );
        }
    },
    fetch_history: async (context: any, payload: any) => {
        const data: HistoryEntry[] = await API_HISTORY_FETCH( payload.refID, payload.refType );
        if (data !== undefined) {
            context.commit( 'CURATION_ADD_HISTORY', { refID: payload.refID, history: data } );
        }
    },
    remove_dataset: (context: any, payload: any) => {
        context.commit( 'CURATION_REMOVE_HISTORY', payload.datasetID );
        context.commit( 'CURATION_REMOVE_DATASET', payload.datasetID );
    },
    truncate_datasets: (context: any) => {
        context.commit( 'CURATION_TRUNCATE_HISTORY' );
        context.commit( 'CURATION_TRUNCATE_DATASETS' );
    },
    fetch_dataset: async (context: any, payload: any) => {
        const query = bodybuilder()
            .filter( 'term', 'source_id', payload.sourceID )
            .filter( 'term', 'source_type', payload.sourceType )
            .build();

        const data = await ELASTIC_QUERY( query, 'dataset', false );
        if (data === undefined) {
            context.dispatch( 'notify/displayNotification', notification( 'error', 'dataset_fetch_offline' ), {root: true });
            return undefined;
        } else {
            if (data.hits.total.value === 1) {
                const dataset: any = data.hits.hits[0]._source;
                context.commit( 'CURATION_ADD_DATASET', dataset );
                context.dispatch( 'fetch_history', { refID: dataset.dataset_id, refType: 'dataset' }, {} );
                return dataset.dataset_id;
            }
        }

        return 0;

    },
    add_curation_drawer_link: (context: any, payload: { dataset_id: number }) => {
        const dataset = context.getters.getOpenDataset(payload.dataset_id);
        if (dataset !== undefined) {
            let datasetInfo = 'Pubmed: ' + dataset.source_id;
            if (dataset.source_type !== 'pubmed') {
                datasetInfo = dataset.source_type + ' ' + dataset.source_id;
            }
            const curationNavDrawerLink: CurationDrawerLink = {
                to: '/curation/DatasetView/' + payload.dataset_id,
                icon: 'mdi-book-open-page-variant',
                text: 'Read Dataset',
                subtitle: datasetInfo,
            };

            context.commit( 'CURATION_ADD_DRAWER_LINK', { refID: payload.dataset_id, link: curationNavDrawerLink });
            context.dispatch( 'rebuild_current_drawer_links' );
        }
    },
    rebuild_current_drawer_links: async (context: any) => {
        const curationDrawerLinkList = [];
        for (const [key, val] of context.state.curationDrawerLinkMap.entries()) {
            curationDrawerLinkList.push(val);
        }
        context.commit( 'CURATION_UPDATE_CURRENT_DRAWER_LINKS',  curationDrawerLinkList );
    },
};

export default moduleCurationActions;
