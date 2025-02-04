const moduleNotifyActions = {
    showNotifyBar: (context: any) => {
        context.commit( 'SHOW_NOTIFY' );
    },
    hideNotifyBar: (context: any) => {
        context.commit( 'HIDE_NOTIFY' );
    },
    displayNotification: (context: any, payload: any ) => {
        return new Promise((resolve, reject) => {
            context.commit( 'SET_NOTIFY_MESSAGE', payload.message );
            context.commit( 'SET_NOTIFY_COLOR', payload.color );
            context.commit( 'SHOW_NOTIFY' );
            resolve();
        });
    },
};

export default moduleNotifyActions;
