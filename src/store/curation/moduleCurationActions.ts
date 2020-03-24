import { CurationGroupEntry, CurationGroupHash, API_CURATION_GROUP_FETCH } from '@/models/curation/CurationGroup';
import { AttributeTypeEntry, AttributeTypeHash, API_ATTRIBUTE_TYPE_FETCH } from '@/models/curation/AttributeType';
import { ProcessingTask, ProcessingTaskHash, API_TASK_FETCH } from '@/models/curation/ProcessingTask';
import { API_HISTORY_FETCH, HistoryEntry } from '@/models/curation/History';
import bodybuilder from 'bodybuilder';
import { ELASTIC_QUERY } from '@/models/elastic/Query';
import router from '@/router';
import notification from '@/utils/Notifications';

const moduleCurationActions = {
    toggleDatasetCollapsed: (context: any) => {
        context.commit( 'TOGGLE_DATASET_COLLAPSED' );
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
    fetch_current_history: async (context: any, payload: any) => {
        const data: HistoryEntry[] = await API_HISTORY_FETCH( payload.refID, payload.refType );
        if (data !== undefined) {
            context.commit( 'CURATION_UPDATE_CURRENT_HISTORY', data );
        }
    },
    reset_current_dataset: (context: any) => {
        context.commit( 'CURATION_UPDATE_CURRENT_DATASET', {} );
        context.commit( 'CURATION_UPDATE_DRAWER_LINKS', [] );
        context.commit( 'CURATION_UPDATE_CURRENT_HISTORY', [] );
    },
    fetch_current_dataset: async (context: any, payload: any) => {
        const query = bodybuilder()
            .filter( 'term', 'source_id', payload.sourceID )
            .filter( 'term', 'source_type', payload.sourceType )
            .build();

        const data = await ELASTIC_QUERY( query, 'dataset', false );
        if (data === undefined) {
            context.dispatch( 'notify/displayNotification', notification( 'error', 'dataset_fetch_offline' ), {root: true });
            return undefined;
        } else {
            context.dispatch( 'reset_current_dataset', {}, {} );

            if (data.hits.total.value === 1) {
                const dataset = data.hits.hits[0]._source;
                context.commit( 'CURATION_UPDATE_CURRENT_DATASET', dataset );
                context.dispatch( 'fetch_current_history', { refID: dataset.dataset_id, refType: 'dataset' }, {} );
                return true;
            }
        }

        return false;

    },
    build_curation_drawer_links: (context: any, payload: any) => {
        const currentDataset = context.state.currentDataset;
        let datasetInfo = 'Pubmed: ' + currentDataset.source_id;
        if (currentDataset.source_type !== 'pubmed') {
            datasetInfo = currentDataset.source_type + ' ' + currentDataset.source_id;
        }
        const curationNavDrawerLinks = [{
            to: '/curation/DatasetView',
            icon: 'mdi-book-open-page-variant',
            text: 'Read Dataset',
            subtitle: datasetInfo,
        },
        {
            to: '/curation/DatasetEntities',
            icon: 'mdi-axis-arrow',
            text: 'Dataset Entities',
            subtitle: datasetInfo,
        }];

        context.commit( 'CURATION_UPDATE_DRAWER_LINKS', curationNavDrawerLinks );
    },
};

export default moduleCurationActions;
