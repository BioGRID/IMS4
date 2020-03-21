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
    fetch_curation_groups: (context: any) => {
        return API_CURATION_GROUP_FETCH( (data: CurationGroupEntry[]) => {
            const curationGroupHash: CurationGroupHash = {};
            for (const curationGroup of data) {
                curationGroupHash[Number(curationGroup.curation_group_id)] = curationGroup;
            }
            context.commit( 'CURATION_UPDATE_CURATION_GROUPS', curationGroupHash );
        });
    },
    fetch_attribute_types: (context: any) => {
        return API_ATTRIBUTE_TYPE_FETCH( (data: AttributeTypeEntry[]) => {
            const attributeTypeHash: AttributeTypeHash = {};
            for (const attributeType of data) {
                attributeTypeHash[attributeType.shortcode] = attributeType;
            }
            context.commit( 'CURATION_UPDATE_ATTRIBUTE_TYPES', attributeTypeHash );
        });
    },
    fetch_processing_tasks: (context: any) => {
        return API_TASK_FETCH( context.state.maxProcessingTasks, false, (data: ProcessingTask[]) => {
            const processingTaskHash: ProcessingTaskHash = {};
            for (const task of data) {
                processingTaskHash[task.processing_id] = task;
            }
            context.commit( 'CURATION_UPDATE_PROCESSING_TASKS', processingTaskHash );
        });
    },
    fetch_current_history: (context: any, payload: any) => {
        return API_HISTORY_FETCH( payload.refID, payload.refType, (data: HistoryEntry[]) => {
            context.commit( 'CURATION_UPDATE_CURRENT_HISTORY', data );
        });
    },
    fetch_current_dataset: (context: any, payload: any) => {
        const query = bodybuilder()
            .filter( 'term', 'source_id', payload.sourceID )
            .filter( 'term', 'source_type', payload.sourceType )
            .build();
        ELASTIC_QUERY( query, 'dataset', true, (data: any) => {
            context.commit( 'CURATION_UPDATE_CURRENT_DATASET', {} );
            context.commit( 'CURATION_UPDATE_DRAWER_LINKS', [] );
            context.commit( 'CURATION_UPDATE_CURRENT_HISTORY', [] );
            if (data.hits.total.value === 1) {
                const dataset = data.hits.hits[0]._source;
                context.commit( 'CURATION_UPDATE_CURRENT_DATASET', dataset );
                context.dispatch( 'fetch_current_history', { refID: dataset.dataset_id, refType: 'dataset' }, {} );
                router.push( '/curation/DatasetView' );
            } else {
                context.dispatch( 'notify/displayNotification', notification( 'error', 'dataset_fetch_nonexistant' ), {root: true });
                router.push( '/elements/dashboard' );
            }
        }, (error: any) => {
            if ( !error.response ) {
                context.dispatch( 'notify/displayNotification', notification( 'error', 'dataset_fetch_offline' ), {root: true });
            } else {
                if ( error.response.status === 400 ) {
                    context.dispatch( 'notify/displayNotification', notification( 'error', 'dataset_fetch_improper' ), {root: true });
                } else if ( error.response.status === 500 ) {
                    context.dispatch( 'notify/displayNotification', notification( 'error', 'dataset_fetch_offline' ), {root: true });
                } else if ( error.response.status === 404 ) {
                    context.dispatch( 'notify/displayNotification', notification( 'error', 'dataset_fetch_unrecognized' ), {root: true });
                }
            }
            router.push( '/elements/dashboard' );
        });
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
