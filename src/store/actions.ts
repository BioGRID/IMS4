const actions = {
    // Allow for the collapsing and maximizing of the NavDrawer
    toggleNavDrawerMinimization: (context: any) => {
        context.commit( 'TOGGLE_NAV_DRAWER' );
    },
};

export default actions;
