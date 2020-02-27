import axios from 'axios';
import store from '@/store/store';
import notification from '@/utils/Notifications';

export interface StringHash {
    [key: string]: string;
}

export interface NumericHash {
    [key: string]: number;
}

export interface TaskPayload {
    options: StringHash;
    data: object;
}

export interface TaskNotes {
    [key: string]: string[];
}

export interface LastRun {
    Time: string;
    Valid: boolean;
}

export interface ProcessingTask {
    processing_id?: number;
    task: string;
    payload: TaskPayload;
    processing_code?: string;
    priority: number;
    state: string;
    stats?: NumericHash;
    notes?: TaskNotes;
    user_id: number;
    last_run: LastRun;
    added_date: string;
}


// Add a Task to the Processing Task Queue
export function API_ADD_TASK( task: ProcessingTask, successCallback?: (data: any[]) => void, errorCallback?: (error: any) => void ): any {
    const user = store.getters['auth/getUser'];
    return axios.post( process.env.VUE_APP_ACE_URL! + '/task', {
        headers: { Authorization: 'Bearer ' + user.access_key },
    })
    .then( (res) => {
        if ( res.status === 200 ) {
            if (successCallback !== undefined) {
                successCallback(res.data.data);
            }
        }
    })
    .catch( (error) => {
        console.log(error);
        if (errorCallback !== undefined) {
            errorCallback(error);
        }
    });
}
