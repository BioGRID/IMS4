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
};

export default actions;
