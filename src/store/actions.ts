const actions = {
    // Allow for the collapsing and maximizing of the NavDrawer
    toggleNavDrawerMinimization: (context: any) => {
        context.commit( 'TOGGLE_NAV_DRAWER' );
    },
    toggleLoadingOverlay: (context: any) => {
        context.commit( 'TOGGLE_LOADING_OVERLAY' );
    },
    addMessage: (context: any, payload: any) => {
        context.commit( 'ADD_MESSAGE', payload.message );
    },
    echoMessage: (context: any, payload: any) => {
        context.commit( 'UPDATE_ECHO_MESSAGE', payload.value );
    },
};

export default actions;
