
import { CurationDrawerLink } from '@/models/curation/CurationDrawerLink';

const moduleCurationMutations = {
    CURATION_UPDATE_CURATION_GROUPS: (state: any, curationGroups: object) => {
        state.curationGroups = curationGroups;
    },
    CURATION_ADD_DATASET: (state: any, dataset: any) => {
        state.openDatasets.set(dataset.dataset_id, dataset);
    },
    CURATION_REMOVE_DATASET: (state: any, datasetID: any) => {
        state.openDatasets.delete(datasetID);
    },
    CURATION_TRUNCATE_DATASETS: (state: any) => {
        state.openDatasets.clear();
    },
    CURATION_TOGGLE_DATASET_COLLAPSED: (state: any) => {
        state.datasetCollapsed = !state.datasetCollapsed;
    },
    CURATION_ADD_HISTORY: (state: any, payload: any) => {
        state.openHistory.set(payload.refID, payload.history);
    },
    CURATION_REMOVE_HISTORY: (state: any, refID: number) => {
        state.openHistory.delete(refID);
    },
    CURATION_TRUNCATE_HISTORY: (state: any) => {
        state.openHistory.clear();
    },
    CURATION_UPDATE_ATTRIBUTE_TYPES: (state: any, attributeTypes: object) => {
        state.attributeTypes = attributeTypes;
    },
    CURATION_UPDATE_PROCESSING_TASKS: (state: any, processingTasks: object) => {
        state.processingTasks = processingTasks;
    },
    CURATION_ADD_DRAWER_LINK: (state: any, payload: { refID: number, link: CurationDrawerLink }) => {
        state.curationDrawerLinkMap.set(payload.refID, payload.link);
    },
    CURATION_REMOVE_DRAWER_LINK: (state: any, refID: number ) => {
        state.curationDrawerLinkMap.delete(refID);
    },
    CURATION_TRUNCATE_DRAWER_LINKS: (state: any ) => {
        state.curationDrawerLinkMap.clear();
    },
    CURATION_UPDATE_CURRENT_DRAWER_LINKS: (state: any, links: CurationDrawerLink[] ) => {
        state.currentCurationDrawerLinks = links;
    },
};

export default moduleCurationMutations;
