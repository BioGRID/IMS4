const moduleNotifyMutations = {
    SHOW_NOTIFY: (state: any) => {
        state.notifyBar = true;
    },
    HIDE_NOTIFY: (state: any) => {
        state.notifyBar = false;
    },
    SET_NOTIFY_MESSAGE: (state: any, message: string) => {
        state.notifyMessage = message;
    },
    SET_NOTIFY_COLOR: (state: any, color: string) => {
        state.notifyColor = color;
    },
};

export default moduleNotifyMutations;
